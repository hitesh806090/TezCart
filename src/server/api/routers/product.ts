import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure, sellerProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
        search: z.string().optional(),
        categoryId: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        sortBy: z.enum(["newest", "price-asc", "price-desc", "popular"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {
        status: "ACTIVE",
      };

      // Search filter
      if (input.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { description: { contains: input.search, mode: "insensitive" } },
        ];
      }

      // Category filter
      if (input.categoryId) {
        where.categoryId = input.categoryId;
      }

      // Price filter
      if (input.minPrice !== undefined || input.maxPrice !== undefined) {
        where.variants = {
          some: {
            price: {
              ...(input.minPrice !== undefined && { gte: input.minPrice }),
              ...(input.maxPrice !== undefined && { lte: input.maxPrice }),
            },
          },
        };
      }

      // Determine sort order
      let orderBy: any = { createdAt: "desc" };
      if (input.sortBy === "price-asc") {
        orderBy = { variants: { _count: "asc" } }; // Simplified, ideally sort by min variant price
      } else if (input.sortBy === "price-desc") {
        orderBy = { variants: { _count: "desc" } };
      } else if (input.sortBy === "popular") {
        orderBy = { createdAt: "desc" }; // TODO: Add view count or sales count
      }

      const products = await ctx.db.product.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy,
        include: {
          variants: true,
          media: true,
          seller: {
            select: {
              storeName: true,
              storeUrlSlug: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (products.length > input.limit) {
        const nextItem = products.pop();
        nextCursor = nextItem?.id;
      }

      return {
        products,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          variants: true,
          media: true,
          seller: {
            select: {
              id: true,
              storeName: true,
              storeUrlSlug: true,
              profilePictureUrl: true,
            },
          },
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      return product;
    }),

  create: sellerProcedure
    .input(
      z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        categoryId: z.string().optional(),
        price: z.number().positive(),
        quantity: z.number().int().nonnegative(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        throw new Error("Seller profile not found");
      }

      const product = await ctx.db.product.create({
        data: {
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          sellerId: sellerProfile.id,
          status: "DRAFT",
          variants: {
            create: {
              price: input.price,
              quantity: input.quantity,
            },
          },
        },
        include: {
          variants: true,
        },
      });

      return product;
    }),

  getMyProducts: sellerProcedure.query(async ({ ctx }) => {
    const sellerProfile = await ctx.db.sellerProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!sellerProfile) {
      return [];
    }

    const products = await ctx.db.product.findMany({
      where: {
        sellerId: sellerProfile.id,
      },
      include: {
        variants: true,
        media: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }),

  updateStatus: sellerProcedure
    .input(
      z.object({
        productId: z.string(),
        status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        throw new Error("Seller profile not found");
      }

      // Verify product belongs to seller
      const product = await ctx.db.product.findFirst({
        where: {
          id: input.productId,
          sellerId: sellerProfile.id,
        },
      });

      if (!product) {
        throw new Error("Product not found or unauthorized");
      }

      const updated = await ctx.db.product.update({
        where: { id: input.productId },
        data: { status: input.status },
      });

      return updated;
    }),

  delete: sellerProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        throw new Error("Seller profile not found");
      }

      // Verify product belongs to seller
      const product = await ctx.db.product.findFirst({
        where: {
          id: input.productId,
          sellerId: sellerProfile.id,
        },
      });

      if (!product) {
        throw new Error("Product not found or unauthorized");
      }

      await ctx.db.product.delete({
        where: { id: input.productId },
      });

      return { success: true };
    }),
});

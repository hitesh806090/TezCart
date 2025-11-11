import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const wishlistRouter = createTRPCRouter({
  getMyWishlist: protectedProcedure.query(async ({ ctx }) => {
    const wishlistItems = await ctx.db.wishlistItem.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        product: {
          include: {
            variants: true,
            media: true,
            seller: {
              select: {
                storeName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return wishlistItems;
  }),

  addItem: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if product exists
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Check if already in wishlist
      const existing = await ctx.db.wishlistItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product already in wishlist",
        });
      }

      // Add to wishlist
      return await ctx.db.wishlistItem.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      });
    }),

  removeItem: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.wishlistItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      });

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not in wishlist",
        });
      }

      await ctx.db.wishlistItem.delete({
        where: { id: item.id },
      });

      return { success: true };
    }),

  isInWishlist: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const item = await ctx.db.wishlistItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
        },
      });

      return !!item;
    }),
});

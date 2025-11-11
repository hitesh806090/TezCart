import { z } from "zod";
import { createTRPCRouter, adminProcedure, publicProcedure } from "@/server/api/trpc";

export const cmsRouter = createTRPCRouter({
  // Homepage Sections
  getHomepageSections: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  }),

  createSection: adminProcedure
    .input(
      z.object({
        type: z.enum(["HERO", "FEATURED_PRODUCTS", "CATEGORIES", "BANNER", "TESTIMONIALS"]),
        title: z.string(),
        content: z.any(),
        order: z.number(),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.homepageSection.create({
        data: input,
      });
    }),

  updateSection: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.any().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.homepageSection.update({
        where: { id },
        data,
      });
    }),

  deleteSection: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.homepageSection.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  // Featured Products
  getFeaturedProducts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.product.findMany({
      where: {
        isFeatured: true,
        status: "ACTIVE",
      },
      include: {
        media: true,
        seller: {
          select: {
            storeName: true,
          },
        },
      },
      take: 12,
    });
  }),

  setFeaturedProducts: adminProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      // Unfeature all products
      await ctx.db.product.updateMany({
        where: { isFeatured: true },
        data: { isFeatured: false },
      });

      // Feature selected products
      await ctx.db.product.updateMany({
        where: { id: { in: input.productIds } },
        data: { isFeatured: true },
      });

      return { success: true };
    }),

  // Banners
  getBanners: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.banner.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      orderBy: { order: "asc" },
    });
  }),

  createBanner: adminProcedure
    .input(
      z.object({
        title: z.string(),
        imageUrl: z.string(),
        linkUrl: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
        order: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.banner.create({
        data: {
          ...input,
          isActive: true,
        },
      });
    }),
});

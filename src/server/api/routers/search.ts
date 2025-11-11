import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const searchRouter = createTRPCRouter({
  globalSearch: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        type: z.enum(["ALL", "PRODUCTS", "SELLERS"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const searchTerm = input.query.toLowerCase();

      let products: any[] = [];
      let sellers: any[] = [];

      if (!input.type || input.type === "ALL" || input.type === "PRODUCTS") {
        products = await ctx.db.product.findMany({
          where: {
            OR: [
              { title: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
              { category: { contains: searchTerm, mode: "insensitive" } },
            ],
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
          take: 10,
        });
      }

      if (!input.type || input.type === "ALL" || input.type === "SELLERS") {
        sellers = await ctx.db.sellerProfile.findMany({
          where: {
            OR: [
              { storeName: { contains: searchTerm, mode: "insensitive" } },
              { storeDescription: { contains: searchTerm, mode: "insensitive" } },
            ],
            status: "APPROVED",
          },
          include: {
            _count: {
              select: {
                products: true,
              },
            },
          },
          take: 10,
        });
      }

      return {
        products,
        sellers,
        total: products.length + sellers.length,
      };
    }),

  getSearchSuggestions: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const searchTerm = input.query.toLowerCase();

      const products = await ctx.db.product.findMany({
        where: {
          title: { contains: searchTerm, mode: "insensitive" },
          status: "ACTIVE",
        },
        select: {
          id: true,
          title: true,
        },
        take: 5,
      });

      return products.map((p: any) => p.title);
    }),

  getTrendingSearches: publicProcedure.query(async ({ ctx }) => {
    // In a real app, this would track actual search queries
    // For now, return popular categories
    const categories = await ctx.db.category.findMany({
      take: 5,
      orderBy: { name: "asc" },
    });

    return categories.map((c: any) => c.name);
  }),
});

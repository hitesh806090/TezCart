import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const favoriteRouter = createTRPCRouter({
  getMyFavoriteSellers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.favoriteSeller.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        seller: {
          include: {
            _count: {
              select: {
                products: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  addFavoriteSeller: protectedProcedure
    .input(z.object({ sellerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.favoriteSeller.create({
        data: {
          userId: ctx.session.user.id,
          sellerId: input.sellerId,
        },
      });
    }),

  removeFavoriteSeller: protectedProcedure
    .input(z.object({ sellerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.favoriteSeller.deleteMany({
        where: {
          userId: ctx.session.user.id,
          sellerId: input.sellerId,
        },
      });

      return { success: true };
    }),

  isFavoriteSeller: protectedProcedure
    .input(z.object({ sellerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const favorite = await ctx.db.favoriteSeller.findFirst({
        where: {
          userId: ctx.session.user.id,
          sellerId: input.sellerId,
        },
      });

      return !!favorite;
    }),
});

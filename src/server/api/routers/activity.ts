import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const activityRouter = createTRPCRouter({
  getMyActivity: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.userActivity.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
    }),

  logActivity: protectedProcedure
    .input(
      z.object({
        type: z.enum([
          "PRODUCT_VIEW",
          "PRODUCT_SEARCH",
          "ADD_TO_CART",
          "PURCHASE",
          "REVIEW_POSTED",
        ]),
        productId: z.string().optional(),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.userActivity.create({
        data: {
          userId: ctx.session.user.id,
          type: input.type,
          productId: input.productId,
          metadata: input.metadata,
        },
      });
    }),
});

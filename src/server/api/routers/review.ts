import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const reviewRouter = createTRPCRouter({
  getByProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.db.review.findMany({
        where: {
          productId: input.productId,
          status: "APPROVED",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const stats = await ctx.db.review.aggregate({
        where: {
          productId: input.productId,
          status: "APPROVED",
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

      return {
        reviews,
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count.rating,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        orderId: z.string(),
        rating: z.number().min(1).max(5),
        title: z.string().min(3).max(100),
        comment: z.string().min(10).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has purchased this product
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.orderId,
          userId: ctx.session.user.id,
          items: {
            some: {
              productId: input.productId,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only review products you have purchased",
        });
      }

      // Check if user already reviewed this product
      const existingReview = await ctx.db.review.findFirst({
        where: {
          productId: input.productId,
          userId: ctx.session.user.id,
        },
      });

      if (existingReview) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }

      // Create review
      const review = await ctx.db.review.create({
        data: {
          productId: input.productId,
          userId: ctx.session.user.id,
          orderId: input.orderId,
          rating: input.rating,
          title: input.title,
          comment: input.comment,
          status: "PENDING", // Requires moderation
        },
      });

      return review;
    }),

  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        rating: z.number().min(1).max(5).optional(),
        title: z.string().min(3).max(100).optional(),
        comment: z.string().min(10).max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.reviewId },
      });

      if (!review || review.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return await ctx.db.review.update({
        where: { id: input.reviewId },
        data: {
          rating: input.rating,
          title: input.title,
          comment: input.comment,
          status: "PENDING", // Re-moderate after edit
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.reviewId },
      });

      if (!review || review.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      await ctx.db.review.delete({
        where: { id: input.reviewId },
      });

      return { success: true };
    }),

  markHelpful: protectedProcedure
    .input(z.object({ reviewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.review.findUnique({
        where: { id: input.reviewId },
      });

      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      return await ctx.db.review.update({
        where: { id: input.reviewId },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      });
    }),

  getMyReviews: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.review.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        product: {
          select: {
            title: true,
            media: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});

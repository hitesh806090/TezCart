import { z } from "zod";
import { createTRPCRouter, protectedProcedure, sellerProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const couponRouter = createTRPCRouter({
  create: sellerProcedure
    .input(
      z.object({
        code: z.string().min(3).max(20).toUpperCase(),
        discountType: z.enum(["PERCENTAGE", "FIXED"]),
        discountValue: z.number().min(0),
        minPurchase: z.number().min(0).optional(),
        maxDiscount: z.number().min(0).optional(),
        usageLimit: z.number().min(1).optional(),
        expiresAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seller profile not found",
        });
      }

      // Check if code already exists
      const existing = await ctx.db.coupon.findFirst({
        where: {
          code: input.code,
          sellerId: sellerProfile.id,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Coupon code already exists",
        });
      }

      return await ctx.db.coupon.create({
        data: {
          ...input,
          sellerId: sellerProfile.id,
        },
      });
    }),

  getMyCoupons: sellerProcedure.query(async ({ ctx }) => {
    const sellerProfile = await ctx.db.sellerProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!sellerProfile) {
      return [];
    }

    return await ctx.db.coupon.findMany({
      where: { sellerId: sellerProfile.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  validate: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        sellerId: z.string(),
        cartTotal: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const coupon = await ctx.db.coupon.findFirst({
        where: {
          code: input.code.toUpperCase(),
          sellerId: input.sellerId,
          isActive: true,
        },
      });

      if (!coupon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid coupon code",
        });
      }

      // Check expiration
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Coupon has expired",
        });
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Coupon usage limit reached",
        });
      }

      // Check minimum purchase
      if (coupon.minPurchase && input.cartTotal < coupon.minPurchase) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Minimum purchase of $${coupon.minPurchase} required`,
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (input.cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, coupon.maxDiscount);
        }
      } else {
        discountAmount = coupon.discountValue;
      }

      return {
        coupon,
        discountAmount,
        finalTotal: input.cartTotal - discountAmount,
      };
    }),

  updateStatus: sellerProcedure
    .input(
      z.object({
        couponId: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seller profile not found",
        });
      }

      const coupon = await ctx.db.coupon.findUnique({
        where: { id: input.couponId },
      });

      if (!coupon || coupon.sellerId !== sellerProfile.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Coupon not found",
        });
      }

      return await ctx.db.coupon.update({
        where: { id: input.couponId },
        data: { isActive: input.isActive },
      });
    }),

  delete: sellerProcedure
    .input(z.object({ couponId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seller profile not found",
        });
      }

      const coupon = await ctx.db.coupon.findUnique({
        where: { id: input.couponId },
      });

      if (!coupon || coupon.sellerId !== sellerProfile.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Coupon not found",
        });
      }

      await ctx.db.coupon.delete({
        where: { id: input.couponId },
      });

      return { success: true };
    }),
});

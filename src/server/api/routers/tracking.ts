import { z } from "zod";
import { createTRPCRouter, protectedProcedure, sellerProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const trackingRouter = createTRPCRouter({
  addTracking: sellerProcedure
    .input(
      z.object({
        orderId: z.string(),
        carrier: z.string(),
        trackingNumber: z.string(),
        estimatedDelivery: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
        include: {
          items: {
            include: {
              seller: true,
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // Verify seller owns this order
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!sellerProfile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seller profile not found",
        });
      }

      const hasItems = order.items.some((item: any) => item.sellerId === sellerProfile.id);
      if (!hasItems) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this order",
        });
      }

      return await ctx.db.orderTracking.create({
        data: {
          orderId: input.orderId,
          carrier: input.carrier,
          trackingNumber: input.trackingNumber,
          estimatedDelivery: input.estimatedDelivery,
          status: "IN_TRANSIT",
        },
      });
    }),

  getByOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
      });

      if (!order || order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return await ctx.db.orderTracking.findMany({
        where: { orderId: input.orderId },
        orderBy: { createdAt: "desc" },
      });
    }),

  updateStatus: sellerProcedure
    .input(
      z.object({
        trackingId: z.string(),
        status: z.enum(["IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED"]),
        location: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.orderTracking.update({
        where: { id: input.trackingId },
        data: {
          status: input.status,
          currentLocation: input.location,
        },
      });
    }),
});

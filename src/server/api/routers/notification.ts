import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const notificationRouter = createTRPCRouter({
  getMyNotifications: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.notification.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.notification.count({
      where: {
        userId: ctx.session.user.id,
        isRead: false,
      },
    });
  }),

  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.notification.update({
        where: {
          id: input.notificationId,
          userId: ctx.session.user.id,
        },
        data: { isRead: true },
      });
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.notification.updateMany({
      where: {
        userId: ctx.session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  }),

  delete: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.notification.delete({
        where: {
          id: input.notificationId,
          userId: ctx.session.user.id,
        },
      });

      return { success: true };
    }),

  // Helper function to create notifications (used internally)
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.enum([
          "ORDER_PLACED",
          "ORDER_SHIPPED",
          "ORDER_DELIVERED",
          "RETURN_APPROVED",
          "RETURN_REJECTED",
          "MESSAGE_RECEIVED",
          "REVIEW_POSTED",
          "SELLER_APPROVED",
        ]),
        title: z.string(),
        message: z.string(),
        link: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.notification.create({
        data: input,
      });
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const disputeRouter = createTRPCRouter({
  createDispute: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        type: z.enum([
          "ITEM_NOT_RECEIVED",
          "ITEM_NOT_AS_DESCRIBED",
          "DEFECTIVE_ITEM",
          "WRONG_ITEM",
          "REFUND_NOT_RECEIVED",
        ]),
        description: z.string().min(20).max(1000),
        evidence: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
      });

      if (!order || order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return await ctx.db.dispute.create({
        data: {
          userId: ctx.session.user.id,
          orderId: input.orderId,
          type: input.type,
          description: input.description,
          evidence: input.evidence,
          status: "OPEN",
        },
      });
    }),

  getMyDisputes: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.dispute.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        order: {
          select: {
            id: true,
            total: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getAllDisputes: adminProcedure
    .input(
      z.object({
        status: z
          .enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "CLOSED"])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.dispute.findMany({
        where: input.status ? { status: input.status } : undefined,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          order: {
            include: {
              items: {
                include: {
                  product: {
                    select: {
                      title: true,
                    },
                  },
                  seller: {
                    select: {
                      storeName: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  updateDisputeStatus: adminProcedure
    .input(
      z.object({
        disputeId: z.string(),
        status: z.enum(["UNDER_REVIEW", "RESOLVED", "CLOSED"]),
        resolution: z.string().optional(),
        refundAmount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { disputeId, ...data } = input;

      const dispute = await ctx.db.dispute.update({
        where: { id: disputeId },
        data: {
          ...data,
          resolvedAt: new Date(),
          resolvedBy: ctx.session.user.id,
        },
      });

      // If resolved with refund, process refund
      if (data.status === "RESOLVED" && data.refundAmount) {
        // Create refund record
        await ctx.db.refund.create({
          data: {
            orderId: dispute.orderId,
            amount: data.refundAmount,
            reason: dispute.type,
            status: "PENDING",
          },
        });
      }

      return dispute;
    }),

  addDisputeMessage: protectedProcedure
    .input(
      z.object({
        disputeId: z.string(),
        message: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.disputeMessage.create({
        data: {
          disputeId: input.disputeId,
          userId: ctx.session.user.id,
          message: input.message,
        },
      });
    }),

  getDisputeMessages: protectedProcedure
    .input(z.object({ disputeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const dispute = await ctx.db.dispute.findUnique({
        where: { id: input.disputeId },
      });

      if (!dispute) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dispute not found",
        });
      }

      // Check authorization
      if (
        dispute.userId !== ctx.session.user.id &&
        ctx.session.user.role !== "ADMIN" &&
        ctx.session.user.role !== "SUPER_ADMIN"
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized",
        });
      }

      return await ctx.db.disputeMessage.findMany({
        where: { disputeId: input.disputeId },
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    }),
});

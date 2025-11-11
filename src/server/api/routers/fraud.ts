import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";

export const fraudRouter = createTRPCRouter({
  getFraudAlerts: adminProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "REVIEWING", "RESOLVED", "FALSE_POSITIVE"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.fraudAlert.findMany({
        where: input.status ? { status: input.status } : undefined,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              total: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
    }),

  createFraudAlert: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        orderId: z.string().optional(),
        type: z.enum([
          "SUSPICIOUS_PAYMENT",
          "HIGH_VALUE_ORDER",
          "RAPID_ORDERS",
          "ADDRESS_MISMATCH",
          "STOLEN_CARD",
        ]),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        description: z.string(),
        metadata: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.fraudAlert.create({
        data: {
          ...input,
          status: "PENDING",
        },
      });
    }),

  updateAlertStatus: adminProcedure
    .input(
      z.object({
        alertId: z.string(),
        status: z.enum(["REVIEWING", "RESOLVED", "FALSE_POSITIVE"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { alertId, ...data } = input;
      return await ctx.db.fraudAlert.update({
        where: { id: alertId },
        data: {
          ...data,
          reviewedAt: new Date(),
          reviewedBy: ctx.session.user.id,
        },
      });
    }),

  getRiskScore: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Calculate risk score based on user behavior
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          orders: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
      });

      if (!user) return { riskScore: 0, factors: [] };

      const factors: string[] = [];
      let score = 0;

      // New user
      if (user._count.orders < 3) {
        score += 20;
        factors.push("New user with limited history");
      }

      // Check for rapid orders
      const recentOrders = user.orders.filter(
        (o: any) =>
          new Date(o.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      if (recentOrders.length > 5) {
        score += 30;
        factors.push("Multiple orders in 24 hours");
      }

      // High value orders
      const highValueOrders = user.orders.filter((o: any) => o.total > 1000);
      if (highValueOrders.length > 0) {
        score += 15;
        factors.push("High value order detected");
      }

      return {
        riskScore: Math.min(score, 100),
        factors,
        recommendation:
          score > 70
            ? "HIGH_RISK"
            : score > 40
            ? "MEDIUM_RISK"
            : "LOW_RISK",
      };
    }),

  blockUser: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        reason: z.string(),
        duration: z.enum(["TEMPORARY", "PERMANENT"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          isBlocked: true,
          blockReason: input.reason,
          blockedAt: new Date(),
        },
      });
    }),
});

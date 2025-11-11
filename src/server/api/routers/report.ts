import { z } from "zod";
import { createTRPCRouter, protectedProcedure, adminProcedure } from "@/server/api/trpc";

export const reportRouter = createTRPCRouter({
  reportProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        reason: z.enum([
          "COUNTERFEIT",
          "INAPPROPRIATE",
          "MISLEADING",
          "COPYRIGHT",
          "OTHER",
        ]),
        description: z.string().min(10).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.report.create({
        data: {
          userId: ctx.session.user.id,
          productId: input.productId,
          reason: input.reason,
          description: input.description,
          status: "PENDING",
        },
      });
    }),

  reportSeller: protectedProcedure
    .input(
      z.object({
        sellerId: z.string(),
        reason: z.enum([
          "FRAUD",
          "POOR_SERVICE",
          "FAKE_PRODUCTS",
          "HARASSMENT",
          "OTHER",
        ]),
        description: z.string().min(10).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.report.create({
        data: {
          userId: ctx.session.user.id,
          sellerId: input.sellerId,
          reason: input.reason,
          description: input.description,
          status: "PENDING",
        },
      });
    }),

  getAllReports: adminProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "REVIEWING", "RESOLVED", "DISMISSED"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.report.findMany({
        where: input.status ? { status: input.status } : undefined,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
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
        orderBy: { createdAt: "desc" },
      });
    }),

  updateReportStatus: adminProcedure
    .input(
      z.object({
        reportId: z.string(),
        status: z.enum(["REVIEWING", "RESOLVED", "DISMISSED"]),
        adminNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.report.update({
        where: { id: input.reportId },
        data: {
          status: input.status,
          adminNotes: input.adminNotes,
          reviewedAt: new Date(),
        },
      });
    }),
});

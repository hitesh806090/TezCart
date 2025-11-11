import { z } from "zod";
import { createTRPCRouter, protectedProcedure, sellerProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const returnRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        orderItemId: z.string(),
        reason: z.enum([
          "DEFECTIVE",
          "WRONG_ITEM",
          "NOT_AS_DESCRIBED",
          "CHANGED_MIND",
          "OTHER",
        ]),
        description: z.string().min(10).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get order item
      const orderItem = await ctx.db.orderItem.findUnique({
        where: { id: input.orderItemId },
        include: {
          order: true,
        },
      });

      if (!orderItem || orderItem.order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order item not found",
        });
      }

      // Check if order is delivered
      if (orderItem.status !== "DELIVERED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Can only return delivered items",
        });
      }

      // Check if already returned
      const existingReturn = await ctx.db.return.findFirst({
        where: { orderItemId: input.orderItemId },
      });

      if (existingReturn) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Return request already exists for this item",
        });
      }

      // Create return request
      return await ctx.db.return.create({
        data: {
          orderItemId: input.orderItemId,
          reason: input.reason,
          description: input.description,
          status: "PENDING",
        },
      });
    }),

  getMyReturns: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.return.findMany({
      where: {
        orderItem: {
          order: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        orderItem: {
          include: {
            product: {
              include: {
                media: true,
              },
            },
            order: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getSellerReturns: sellerProcedure.query(async ({ ctx }) => {
    const sellerProfile = await ctx.db.sellerProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!sellerProfile) {
      return [];
    }

    return await ctx.db.return.findMany({
      where: {
        orderItem: {
          sellerId: sellerProfile.id,
        },
      },
      include: {
        orderItem: {
          include: {
            product: {
              include: {
                media: true,
              },
            },
            order: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  updateStatus: sellerProcedure
    .input(
      z.object({
        returnId: z.string(),
        status: z.enum(["APPROVED", "REJECTED"]),
        sellerNotes: z.string().optional(),
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

      const returnRequest = await ctx.db.return.findUnique({
        where: { id: input.returnId },
        include: {
          orderItem: true,
        },
      });

      if (!returnRequest || returnRequest.orderItem.sellerId !== sellerProfile.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Return request not found",
        });
      }

      return await ctx.db.return.update({
        where: { id: input.returnId },
        data: {
          status: input.status,
          sellerNotes: input.sellerNotes,
          processedAt: new Date(),
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ returnId: z.string() }))
    .query(async ({ ctx, input }) => {
      const returnRequest = await ctx.db.return.findUnique({
        where: { id: input.returnId },
        include: {
          orderItem: {
            include: {
              product: {
                include: {
                  media: true,
                },
              },
              order: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!returnRequest) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Return request not found",
        });
      }

      // Check authorization
      const isCustomer = returnRequest.orderItem.order.userId === ctx.session.user.id;
      const sellerProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });
      const isSeller = sellerProfile && returnRequest.orderItem.sellerId === sellerProfile.id;

      if (!isCustomer && !isSeller) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to view this return",
        });
      }

      return returnRequest;
    }),
});

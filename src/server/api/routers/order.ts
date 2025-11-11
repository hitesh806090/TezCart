import { z } from "zod";
import { createTRPCRouter, protectedProcedure, sellerProcedure, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
    .input(
      z.object({
        shippingAddress: z.string(),
        shippingCity: z.string(),
        shippingState: z.string(),
        shippingZipCode: z.string(),
        shippingCountry: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's cart
      const cart = await ctx.db.cart.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      // Calculate totals
      const subtotal = cart.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      const shippingCost = 9.99;
      const tax = subtotal * 0.1;
      const total = subtotal + shippingCost + tax;

      // Create order
      const order = await ctx.db.order.create({
        data: {
          userId: ctx.session.user.id,
          status: "PENDING",
          subtotal,
          shippingCost,
          tax,
          total,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingState: input.shippingState,
          shippingZipCode: input.shippingZipCode,
          shippingCountry: input.shippingCountry,
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              sellerId: item.product.sellerId,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      // Clear cart
      await ctx.db.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Update product quantities
      for (const item of cart.items as any[]) {
        await ctx.db.productVariant.update({
          where: { id: item.variantId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                media: true,
              },
            },
            variant: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  }),

  getOrderById: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  media: true,
                  seller: {
                    select: {
                      storeName: true,
                    },
                  },
                },
              },
              variant: true,
            },
          },
        },
      });

      if (!order || order.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return order;
    }),

  getSellerOrders: sellerProcedure.query(async ({ ctx }) => {
    const sellerProfile = await ctx.db.sellerProfile.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!sellerProfile) {
      return [];
    }

    const orders = await ctx.db.orderItem.findMany({
      where: { sellerId: sellerProfile.id },
      include: {
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
        product: {
          include: {
            media: true,
          },
        },
        variant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders;
  }),

  updateOrderStatus: sellerProcedure
    .input(
      z.object({
        orderItemId: z.string(),
        status: z.enum(["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
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

      const orderItem = await ctx.db.orderItem.findUnique({
        where: { id: input.orderItemId },
      });

      if (!orderItem || orderItem.sellerId !== sellerProfile.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order item not found",
        });
      }

      // Update order item status
      const updated = await ctx.db.orderItem.update({
        where: { id: input.orderItemId },
        data: { status: input.status },
      });

      // If delivered, create ledger entry for payout
      if (input.status === "DELIVERED") {
        const platformFee = orderItem.price * orderItem.quantity * 0.1; // 10% platform fee
        const sellerAmount = orderItem.price * orderItem.quantity - platformFee;

        await ctx.db.ledgerEntry.create({
          data: {
            sellerId: sellerProfile.id,
            orderId: orderItem.orderId,
            amount: sellerAmount,
            type: "SALE",
            status: "PENDING",
            description: `Sale of ${orderItem.quantity} unit(s)`,
          },
        });
      }

      return updated;
    }),

  getAllOrders: adminProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
            seller: {
              select: {
                storeName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return orders;
  }),
});

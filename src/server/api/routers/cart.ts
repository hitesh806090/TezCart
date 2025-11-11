import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    let cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
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

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await ctx.db.cart.create({
        data: {
          userId: ctx.session.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  variants: true,
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
    }

    return cart;
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify product exists and is active
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
        include: { variants: true },
      });

      if (!product || product.status !== "ACTIVE") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found or unavailable",
        });
      }

      const variant = product.variants.find((v: any) => v.id === input.variantId);
      if (!variant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product variant not found",
        });
      }

      if (variant.quantity < input.quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient stock",
        });
      }

      // Get or create cart
      let cart = await ctx.db.cart.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!cart) {
        cart = await ctx.db.cart.create({
          data: { userId: ctx.session.user.id },
        });
      }

      // Check if item already exists in cart
      const existingItem = await ctx.db.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: input.productId,
          variantId: input.variantId,
        },
      });

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + input.quantity;
        if (newQuantity > variant.quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot add more items than available in stock",
          });
        }

        return await ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      } else {
        // Add new item
        return await ctx.db.cartItem.create({
          data: {
            cartId: cart.id,
            productId: input.productId,
            variantId: input.variantId,
            quantity: input.quantity,
            price: variant.price,
          },
        });
      }
    }),

  updateItemQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        quantity: z.number().int().nonnegative(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.cartItem.findUnique({
        where: { id: input.itemId },
        include: {
          cart: true,
          variant: true,
        },
      });

      if (!item || item.cart.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      if (input.quantity === 0) {
        // Remove item
        return await ctx.db.cartItem.delete({
          where: { id: input.itemId },
        });
      }

      if (input.quantity > item.variant.quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Insufficient stock",
        });
      }

      return await ctx.db.cartItem.update({
        where: { id: input.itemId },
        data: { quantity: input.quantity },
      });
    }),

  removeItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.db.cartItem.findUnique({
        where: { id: input.itemId },
        include: { cart: true },
      });

      if (!item || item.cart.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      await ctx.db.cartItem.delete({
        where: { id: input.itemId },
      });

      return { success: true };
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const cart = await ctx.db.cart.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!cart) {
      return { success: true };
    }

    await ctx.db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { success: true };
  }),
});

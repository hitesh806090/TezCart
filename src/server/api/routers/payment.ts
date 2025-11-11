import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const paymentRouter = createTRPCRouter({
  getMyPaymentMethods: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.paymentMethod.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  addPaymentMethod: protectedProcedure
    .input(
      z.object({
        type: z.enum(["CREDIT_CARD", "DEBIT_CARD", "PAYPAL"]),
        cardLast4: z.string().optional(),
        cardBrand: z.string().optional(),
        expiryMonth: z.number().optional(),
        expiryYear: z.number().optional(),
        stripePaymentMethodId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.paymentMethod.create({
        data: {
          userId: ctx.session.user.id,
          ...input,
        },
      });
    }),

  setDefault: protectedProcedure
    .input(z.object({ paymentMethodId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Unset all other defaults
      await ctx.db.paymentMethod.updateMany({
        where: {
          userId: ctx.session.user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      });

      // Set new default
      return await ctx.db.paymentMethod.update({
        where: {
          id: input.paymentMethodId,
          userId: ctx.session.user.id,
        },
        data: { isDefault: true },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ paymentMethodId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const paymentMethod = await ctx.db.paymentMethod.findUnique({
        where: { id: input.paymentMethodId },
      });

      if (!paymentMethod || paymentMethod.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment method not found",
        });
      }

      await ctx.db.paymentMethod.delete({
        where: { id: input.paymentMethodId },
      });

      return { success: true };
    }),
});

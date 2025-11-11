import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const addressRouter = createTRPCRouter({
  getMyAddresses: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.address.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(2),
        phone: z.string().min(10),
        addressLine1: z.string().min(5),
        addressLine2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().min(2),
        postalCode: z.string().min(5),
        country: z.string().min(2),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // If setting as default, unset other defaults
      if (input.isDefault) {
        await ctx.db.address.updateMany({
          where: {
            userId: ctx.session.user.id,
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }

      return await ctx.db.address.create({
        data: {
          userId: ctx.session.user.id,
          ...input,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fullName: z.string().min(2).optional(),
        phone: z.string().min(10).optional(),
        addressLine1: z.string().min(5).optional(),
        addressLine2: z.string().optional(),
        city: z.string().min(2).optional(),
        state: z.string().min(2).optional(),
        postalCode: z.string().min(5).optional(),
        country: z.string().min(2).optional(),
        isDefault: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const address = await ctx.db.address.findUnique({
        where: { id },
      });

      if (!address || address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found",
        });
      }

      // If setting as default, unset other defaults
      if (input.isDefault) {
        await ctx.db.address.updateMany({
          where: {
            userId: ctx.session.user.id,
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }

      return await ctx.db.address.update({
        where: { id },
        data,
      });
    }),

  setDefault: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.db.address.findUnique({
        where: { id: input.id },
      });

      if (!address || address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found",
        });
      }

      // Unset other defaults
      await ctx.db.address.updateMany({
        where: {
          userId: ctx.session.user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      });

      // Set new default
      return await ctx.db.address.update({
        where: { id: input.id },
        data: { isDefault: true },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.db.address.findUnique({
        where: { id: input.id },
      });

      if (!address || address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found",
        });
      }

      await ctx.db.address.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

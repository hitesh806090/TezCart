import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.category.findMany({
      orderBy: { name: "asc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.category.findUnique({
        where: { id: input.id },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        slug: z.string().min(2).max(50),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if slug exists
      const existing = await ctx.db.category.findUnique({
        where: { slug: input.slug },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category slug already exists",
        });
      }

      return await ctx.db.category.create({
        data: input,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(50).optional(),
        slug: z.string().min(2).max(50).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return await ctx.db.category.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if category has products
      const productCount = await ctx.db.product.count({
        where: { category: input.id },
      });

      if (productCount > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot delete category with ${productCount} products`,
        });
      }

      await ctx.db.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

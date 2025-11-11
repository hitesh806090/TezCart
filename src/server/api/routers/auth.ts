import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import * as bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(2).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: "CUSTOMER",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      return { user };
    }),

  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});

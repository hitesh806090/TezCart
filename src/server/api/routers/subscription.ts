import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const subscriptionRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.newsletter.create({
        data: {
          email: input.email,
          userId: ctx.session.user.id,
        },
      });
    }),

  unsubscribe: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.newsletter.deleteMany({
        where: {
          email: input.email,
          userId: ctx.session.user.id,
        },
      });

      return { success: true };
    }),

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.newsletter.findFirst({
      where: { userId: ctx.session.user.id },
    });

    return { subscribed: !!subscription };
  }),
});

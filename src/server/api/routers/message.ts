import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await ctx.db.conversation.findMany({
      where: {
        OR: [
          { customerId: ctx.session.user.id },
          { sellerId: ctx.session.user.id },
        ],
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            storeName: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return conversations;
  }),

  getConversation: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.conversationId },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          seller: {
            select: {
              storeName: true,
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      // Check authorization
      if (
        conversation.customerId !== ctx.session.user.id &&
        conversation.sellerId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to view this conversation",
        });
      }

      return conversation;
    }),

  startConversation: protectedProcedure
    .input(
      z.object({
        sellerId: z.string(),
        productId: z.string().optional(),
        initialMessage: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if conversation already exists
      const existing = await ctx.db.conversation.findFirst({
        where: {
          customerId: ctx.session.user.id,
          sellerId: input.sellerId,
        },
      });

      if (existing) {
        // Add message to existing conversation
        await ctx.db.message.create({
          data: {
            conversationId: existing.id,
            senderId: ctx.session.user.id,
            content: input.initialMessage,
          },
        });

        await ctx.db.conversation.update({
          where: { id: existing.id },
          data: { updatedAt: new Date() },
        });

        return existing;
      }

      // Create new conversation
      const conversation = await ctx.db.conversation.create({
        data: {
          customerId: ctx.session.user.id,
          sellerId: input.sellerId,
          productId: input.productId,
          messages: {
            create: {
              senderId: ctx.session.user.id,
              content: input.initialMessage,
            },
          },
        },
      });

      return conversation;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.db.conversation.findUnique({
        where: { id: input.conversationId },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      // Check authorization
      if (
        conversation.customerId !== ctx.session.user.id &&
        conversation.sellerId !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to send messages in this conversation",
        });
      }

      const message = await ctx.db.message.create({
        data: {
          conversationId: input.conversationId,
          senderId: ctx.session.user.id,
          content: input.content,
        },
      });

      // Update conversation timestamp
      await ctx.db.conversation.update({
        where: { id: input.conversationId },
        data: { updatedAt: new Date() },
      });

      return message;
    }),

  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.message.updateMany({
        where: {
          conversationId: input.conversationId,
          senderId: { not: ctx.session.user.id },
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });

      return { success: true };
    }),
});

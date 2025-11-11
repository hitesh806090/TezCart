import { z } from "zod";
import { createTRPCRouter, protectedProcedure, sellerProcedure, adminProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const sellerRouter = createTRPCRouter({
  applyToBecomeSeller: protectedProcedure
    .input(
      z.object({
        sellerType: z.enum(["INDIVIDUAL", "BUSINESS"]),
        legalName: z.string().min(2),
        dateOfBirth: z.date().optional(),
        businessRegistrationNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingProfile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (existingProfile) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Seller profile already exists",
        });
      }

      const sellerProfile = await ctx.db.sellerProfile.create({
        data: {
          userId: ctx.session.user.id,
          sellerType: input.sellerType,
          legalName: input.legalName,
          dateOfBirth: input.dateOfBirth,
          businessRegistrationNumber: input.businessRegistrationNumber,
          applicationStatus: "UNDER_REVIEW",
        },
      });

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { role: "PROSPECTIVE_SELLER" },
      });

      return sellerProfile;
    }),

  getMyProfile: sellerProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db.sellerProfile.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        addresses: true,
        socialLinks: true,
      },
    });

    return profile;
  }),

  updateStoreProfile: sellerProcedure
    .input(
      z.object({
        storeName: z.string().min(2).optional(),
        storeUrlSlug: z.string().min(2).optional(),
        bio: z.string().optional(),
        publicContactEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.sellerProfile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Seller profile not found",
        });
      }

      const updated = await ctx.db.sellerProfile.update({
        where: { id: profile.id },
        data: {
          ...input,
          isPublic: true,
        },
      });

      return updated;
    }),

  getPendingApplications: adminProcedure.query(async ({ ctx }) => {
    const applications = await ctx.db.sellerProfile.findMany({
      where: {
        applicationStatus: "UNDER_REVIEW",
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        addresses: true,
        documents: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return applications;
  }),

  approveApplication: adminProcedure
    .input(z.object({ profileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.sellerProfile.findUnique({
        where: { id: input.profileId },
      });

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Seller profile not found",
        });
      }

      await ctx.db.$transaction([
        ctx.db.sellerProfile.update({
          where: { id: input.profileId },
          data: { applicationStatus: "APPROVED" },
        }),
        ctx.db.user.update({
          where: { id: profile.userId },
          data: { role: "SELLER" },
        }),
      ]);

      return { success: true };
    }),

  rejectApplication: adminProcedure
    .input(
      z.object({
        profileId: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.sellerProfile.update({
        where: { id: input.profileId },
        data: {
          applicationStatus: "REJECTED",
          notesFromAdmin: input.reason,
        },
      });

      return profile;
    }),
});

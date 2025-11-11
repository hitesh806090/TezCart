import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url()
    ),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_S3_BUCKET_NAME: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    SES_FROM_EMAIL: z.string().email().optional(),
    ELASTICSEARCH_URL: z.string().url().optional(),
    ELASTICSEARCH_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
    ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
    ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

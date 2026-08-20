import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  GROQ_API_KEY: z.string().optional(),
  VAPID_PUBLIC_KEY: z.string().default('BBmtcvmJ4Cpq9hzo_EZhii6Q5ndlnilEMrwAqk2Y8LB5HSBepmcjL4AMAzW9FaTkp_atMWJKMk2GhVLVu1tO8uk'),
  VAPID_PRIVATE_KEY: z.string().default('A2zyYNQW2mFmTtGaMLow3oLZsX6lySjIfKFT3RwxMbw'),
  VAPID_SUBJECT: z.string().default('mailto:support@jarvis-ai.local'),
  // Optional Email Fallback configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional().default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional().default('JARVIS AI <notifications@jarvis-ai.local>'),
  // Telegram Bot integration
  TELEGRAM_BOT_TOKEN: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const config = parsedEnv.data;

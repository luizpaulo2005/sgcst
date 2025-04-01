import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const env = createEnv({
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),

    JWT_SECRET: z.string(),

    GOOGLE_OAUTH_CLIENT_ID: z.string(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
    GOOGLE_OAUTH_REDIRECT_URI: z.string().url(),

    NODEMAILER_SMTP_HOST: z.string(),
    NODEMAILER_SMTP_PORT: z.coerce.number(),
    NODEMAILER_SMTP_USER: z.string(),
    NODEMAILER_SMTP_PASSWORD: z.string(),
  },
  client: {},
  shared: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    SERVER_PORT: process.env.SERVER_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODEMAILER_SMTP_HOST: process.env.NODEMAILER_SMTP_HOST,
    NODEMAILER_SMTP_PORT: process.env.NODEMAILER_SMTP_PORT,
    NODEMAILER_SMTP_USER: process.env.NODEMAILER_SMTP_USER,
    NODEMAILER_SMTP_PASSWORD: process.env.NODEMAILER_SMTP_PASSWORD,
  },
  emptyStringAsUndefined: true,
})

export { env }

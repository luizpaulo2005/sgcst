import { env } from '@sgcst/env'
import { createTransport } from 'nodemailer'

const mail = createTransport({
  host: env.NODEMAILER_SMTP_HOST,
  port: env.NODEMAILER_SMTP_PORT,
  secure: false,
  auth: {
    user: env.NODEMAILER_SMTP_USER,
    pass: env.NODEMAILER_SMTP_PASSWORD,
  },
})

export { mail }

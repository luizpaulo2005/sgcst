import { env } from '@sgcst/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { mail } from '@/lib/nodemailer'
import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const solicitarVerificacaoEmail = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/auth/solicitar-verificacao-email',
      {
        schema: {
          tags: ['autenticacao'],
          summary: 'Solicitar verificação de e-mail',
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()

        const usuario = await prisma.usuario.findUnique({
          where: {
            id: usuarioId,
          },
        })

        if (!usuario) {
          throw new UnauthorizedError()
        }

        if (usuario.emailVerificado) {
          return reply.status(204).send()
        }

        let token = await prisma.token.findFirst({
          where: {
            usuarioId: usuario.id,
            tipo: 'VERIFICAR_EMAIL',
          },
        })

        if (!token) {
          token = await prisma.token.create({
            data: {
              tipo: 'VERIFICAR_EMAIL',
              usuarioId: usuario.id,
              validoAte: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
          })
        }

        await mail.sendMail({
          from: 'SGCST',
          to: usuario.email,
          subject: 'Verificar e-mail',
          html: `Olá ${usuario.nome}, clique <a href="${env.NEXT_PUBLIC_API_URL}/auth/verificar-email?token=${token.id}">aqui</a> verificar seu e-mail. O link é válido por 24 horas.`,
        })

        return reply.status(204).send()
      },
    )
}

export { solicitarVerificacaoEmail }

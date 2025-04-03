import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const verificarEmail = async (app: FastifyInstance) => {
  app
    .register(auth)
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/auth/verificar-email',
      {
        schema: {
          tags: ['autenticacao'],
          summary: 'Verificar e-mail',
          security: [{ bearerAuth: [] }],
          querystring: z.object({
            token: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { token } = request.query

        const tokenFromParams = await prisma.token.findFirst({
          where: { id: token },
        })

        if (!tokenFromParams) {
          throw new UnauthorizedError()
        }

        await prisma.$transaction([
          prisma.usuario.update({
            where: {
              id: tokenFromParams.usuarioId,
            },
            data: {
              emailVerificado: true,
            },
          }),

          prisma.token.delete({
            where: {
              id: tokenFromParams.id,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}

export { verificarEmail }

import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

const obterPerfil = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/perfil',
      {
        schema: {
          tags: ['autenticacao'],
          summary: 'Obter informações do usuário autenticado',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              usuario: z.object({
                id: z.string().uuid(),
                nome: z.string().nullable(),
                email: z.string().email(),
                avatarUrl: z.string().url().nullable(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const usuario = await prisma.usuario.findUnique({
          select: {
            id: true,
            nome: true,
            email: true,
            avatarUrl: true,
          },
          where: {
            id: userId,
          },
        })

        if (!usuario) {
          throw new BadRequestError('Usuário não encontrado.')
        }

        return reply.send({ usuario })
      },
    )
}

export { obterPerfil }

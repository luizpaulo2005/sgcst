import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const criarLocal = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/locais',
      {
        schema: {
          tags: ['locais'],
          summary: 'Criar local',
          security: [{ bearerAuth: [] }],
          body: z.object({
            nome: z.string(),
            avatarUrl: z.string().url().nullish(),
          }),
          response: {
            201: z.object({
              id: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('criar', 'Local')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar um local.',
          )
        }

        const { nome, avatarUrl } = request.body

        const local = await prisma.local.create({
          data: {
            nome,
            avatarUrl,
          },
        })

        return reply.status(201).send({
          id: local.id,
        })
      },
    )
}

export { criarLocal }

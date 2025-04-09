import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterLocais = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/locais',
      {
        schema: {
          tags: ['locais'],
          summary: 'Obter locais',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              locais: z.array(
                z.object({
                  id: z.string(),
                  nome: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  ativo: z.boolean().optional(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot, can } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('visualizar', 'Local')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar locais.',
          )
        }

        const locais = await prisma.local.findMany({
          orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
          select: {
            id: true,
            nome: true,
            avatarUrl: true,
            ativo: can('manage', 'Local') ? true : undefined,
          },
          where: {
            ativo: can('manage', 'Local') ? undefined : true,
          },
        })

        return { locais }
      },
    )
}

export { obterLocais }

import { cargoSchema } from '@sgcst/auth/src/cargos'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterConvites = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/convites',
      {
        schema: {
          tags: ['convites'],
          summary: 'Obter convites',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              convites: z.array(
                z.object({
                  id: z.string(),
                  email: z.string(),
                  cargo: cargoSchema,
                  criadoEm: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('visualizar', 'Convite')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar convites.',
          )
        }

        const convites = await prisma.convite.findMany({
          orderBy: {
            criadoEm: 'desc',
          },
        })

        return { convites }
      },
    )
}

export { obterConvites }

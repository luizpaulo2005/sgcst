import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const atualizarStatusLocal = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/locais/:id/status',
      {
        schema: {
          tags: ['locais'],
          summary: 'Atualizar status do local',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('inativar', 'Local')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar o status do local.',
          )
        }

        const { id } = request.params

        const local = await prisma.local.findUnique({
          where: {
            id,
          },
        })

        if (!local) {
          throw new BadRequestError('Local não encontrado.')
        }

        await prisma.local.update({
          where: {
            id,
          },
          data: {
            ativo: !local.ativo,
          },
        })

        return reply.status(204).send()
      },
    )
}

export { atualizarStatusLocal }

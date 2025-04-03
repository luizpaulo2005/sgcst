import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const revogarConvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/convites/:id',
      {
        schema: {
          tags: ['convites'],
          summary: 'Revogar convite',
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
        const { id } = request.params
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('excluir', 'Convite')) {
          throw new UnauthorizedError(
            'Você não tem permissão para excluir convites.',
          )
        }

        const convite = await prisma.convite.findUnique({
          where: {
            id,
          },
        })

        if (!convite) {
          throw new BadRequestError('Convite não encontrado.')
        }

        await prisma.convite.delete({
          where: {
            id,
          },
        })

        return reply.status(204).send()
      },
    )
}

export { revogarConvite }

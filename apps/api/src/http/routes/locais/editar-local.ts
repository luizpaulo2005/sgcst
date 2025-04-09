import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const editarLocal = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/locais/:id',
      {
        schema: {
          tags: ['locais'],
          summary: 'Editar local',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            nome: z.string(),
            avatarUrl: z.string().url().nullish(),
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

        if (cannot('atualizar', 'Local')) {
          throw new UnauthorizedError(
            'Você não tem permissão para editar um local.',
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

        const { nome, avatarUrl } = request.body

        await prisma.local.update({
          where: {
            id,
          },
          data: {
            nome,
            avatarUrl,
          },
        })

        return reply.status(204).send()
      },
    )
}

export { editarLocal }

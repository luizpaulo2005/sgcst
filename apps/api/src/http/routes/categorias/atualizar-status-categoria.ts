import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const atualizarStatusCategoria = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/categorias/:id/status',
      {
        schema: {
          tags: ['categorias'],
          summary: 'Atualizar status da categoria',
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

        if (cannot('inativar', 'Categoria')) {
          throw new UnauthorizedError(
            'Você não tem permissão para atualizar o status da categoria.',
          )
        }

        const { id } = request.params

        const categoria = await prisma.categoria.findUnique({
          where: {
            id,
          },
        })

        if (!categoria) {
          throw new BadRequestError('Categoria não encontrada.')
        }

        await prisma.categoria.update({
          where: {
            id,
          },
          data: {
            ativo: !categoria.ativo,
          },
        })

        return reply.status(204).send()
      },
    )
}

export { atualizarStatusCategoria }

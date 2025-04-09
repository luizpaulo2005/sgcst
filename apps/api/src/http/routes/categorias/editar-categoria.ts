import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const editarCategoria = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/categorias/:id',
      {
        schema: {
          tags: ['categorias'],
          summary: 'Editar categoria',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            descricao: z.string(),
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

        if (cannot('atualizar', 'Categoria')) {
          throw new UnauthorizedError(
            'Você não tem permissão para editar uma categoria.',
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

        const { descricao } = request.body

        await prisma.categoria.update({
          where: {
            id,
          },
          data: {
            descricao,
          },
        })

        return reply.status(204).send()
      },
    )
}

export { editarCategoria }

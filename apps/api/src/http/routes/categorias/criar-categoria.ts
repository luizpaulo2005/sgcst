import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const criarCategoria = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/categorias',
      {
        schema: {
          tags: ['categorias'],
          summary: 'Criar categoria',
          security: [{ bearerAuth: [] }],
          body: z.object({
            descricao: z.string(),
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

        if (cannot('criar', 'Categoria')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar uma categoria.',
          )
        }

        const { descricao } = request.body

        const categoria = await prisma.categoria.create({
          data: {
            descricao,
          },
        })

        return reply.status(201).send({
          id: categoria.id,
        })
      },
    )
}

export { criarCategoria }

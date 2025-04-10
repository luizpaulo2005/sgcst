import { categoriaSchema } from '@sgcst/auth/src/models/categoria'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterCategorias = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/categorias',
      {
        schema: {
          tags: ['categorias'],
          summary: 'Obter categorias',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              categorias: z.array(
                z.object({
                  id: z.string(),
                  descricao: z.string(),
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

        if (cannot('visualizar', 'Categoria')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar categorias.',
          )
        }

        const categorias = await prisma.categoria.findMany({
          orderBy: [{ ativo: 'desc' }, { descricao: 'asc' }],
          select: {
            id: true,
            descricao: true,
            ativo: true,
          },
        })

        const categoriasFiltradas = categorias.filter((categoria) =>
          can('visualizar', categoriaSchema.parse(categoria)),
        )

        return { categorias: categoriasFiltradas }
      },
    )
}

export { obterCategorias }

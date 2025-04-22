import { cargoSchema } from '@sgcst/auth/src/cargos'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterUsuarios = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/usuarios',
      {
        schema: {
          tags: ['usuarios'],
          summary:
            'Obter todos os usuários (somente administradores e técnicos)',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              usuarios: z.array(
                z.object({
                  id: z.string().uuid(),
                  nome: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                  ativo: z.boolean(),
                  cargo: cargoSchema,
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

        if (cannot('visualizar', 'Usuario')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar usuários.',
          )
        }

        const usuarios = await prisma.usuario.findMany({
          select: {
            id: true,
            nome: true,
            email: true,
            avatarUrl: true,
            ativo: true,
            cargo: true,
          },
          where: {
            cargo: {
              in: ['ADMINISTRADOR', 'TECNICO'],
            },
          },
          orderBy: [{ cargo: 'asc' }, { ativo: 'desc' }, { nome: 'asc' }],
        })

        return { usuarios }
      },
    )
}

export { obterUsuarios }

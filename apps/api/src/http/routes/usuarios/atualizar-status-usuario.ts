import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const atualizarStatusUsuario = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/usuarios/:id/status',
      {
        schema: {
          tags: ['usuarios'],
          summary: 'Atualizar status do usuário',
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

        if (cannot('cancelar', 'Usuario')) {
          throw new UnauthorizedError(
            'Você não tem permissão para inativar usuários.',
          )
        }

        const { id } = request.params

        if (id === usuarioId) {
          throw new BadRequestError(
            'Você não pode alterar o status do usuário atual.',
          )
        }

        const usuario = await prisma.usuario.findUnique({
          where: { id },
        })

        if (!usuario) {
          throw new UnauthorizedError('Usuário não encontrado.')
        }

        await prisma.usuario.update({
          where: { id },
          data: {
            ativo: !usuario.ativo,
          },
        })

        return reply.status(204).send()
      },
    )
}

export { atualizarStatusUsuario }

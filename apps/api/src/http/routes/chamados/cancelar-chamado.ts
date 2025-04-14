import { chamadoSchema } from '@sgcst/auth/src/models/chamado'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const cancelarChamado = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/chamados/:id/cancelar',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Cancelar Chamado',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params

        const chamado = await prisma.chamado.findUnique({
          where: { id },
        })

        if (!chamado) {
          throw new BadRequestError('Chamado não encontrado.')
        }

        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = await getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('cancelar', chamadoSchema.parse(chamado))) {
          throw new UnauthorizedError(
            'Você não tem permissão para cancelar este chamado.',
          )
        }

        if (['FECHADO', 'CANCELADO'].includes(chamado.status)) {
          throw new BadRequestError(
            'Não é possível cancelar um chamado que já foi fechado ou cancelado.',
          )
        }

        const usuario = await prisma.usuario.findUnique({
          where: { id: usuarioId },
          select: {
            nome: true,
          },
        })

        await prisma.$transaction([
          prisma.chamado.update({
            where: { id },
            data: {
              status: 'CANCELADO',
              fechadoPor: usuarioId,
              dataFechamento: new Date(),
            },
          }),
          prisma.logChamado.create({
            data: {
              chamadoId: id,
              usuarioId,
              acao: 'CANCELAR',
              descricao: `Chamado cancelado pelo usuário ${usuario?.nome}.`,
            },
          }),
        ])

        reply.status(204).send()
      },
    )
}

export { cancelarChamado }

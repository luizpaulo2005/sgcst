import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const assumirChamado = (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/chamados/:id/assumir',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Assumir Chamado',
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
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('manage', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para assumir chamados.',
          )
        }

        const { id } = request.params

        const chamado = await prisma.chamado.findUnique({
          where: {
            id,
          },
          select: {
            tecnico: true,
            status: true,
          },
        })

        if (!chamado) {
          throw new BadRequestError('Chamado não encontrado.')
        }

        if (chamado.status === 'CANCELADO') {
          throw new BadRequestError(
            'Não é possível assumir um chamado que já foi cancelado.',
          )
        }

        const usuario = await prisma.usuario.findUnique({
          where: {
            id: usuarioId,
          },
          select: {
            nome: true,
          },
        })

        if (chamado.tecnico) {
          await prisma.$transaction([
            prisma.tecnicoChamado.update({
              where: {
                chamadoId: id,
              },
              data: {
                usuarioId,
              },
            }),
            prisma.logChamado.create({
              data: {
                chamadoId: id,
                usuarioId,
                acao: 'ALTERAR',
                descricao: `Chamado assumido por ${usuario?.nome}`,
              },
            }),
          ])

          return reply.status(204).send()
        }

        await prisma.$transaction([
          prisma.tecnicoChamado.create({
            data: {
              usuarioId,
              chamadoId: id,
            },
          }),
          prisma.logChamado.create({
            data: {
              chamadoId: id,
              usuarioId,
              acao: 'ALTERAR',
              descricao: `Chamado assumido por ${usuario?.nome}`,
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}

export { assumirChamado }

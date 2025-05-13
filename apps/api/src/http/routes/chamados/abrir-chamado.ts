import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const abrirChamado = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/chamados',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Abrir Chamado',
          security: [{ bearerAuth: [] }],
          body: z.object({
            titulo: z.string(),
            descricao: z.string(),
            categoriaId: z.string().nullable(),
            localId: z.string().uuid(),
            prioridade: z
              .enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'])
              .default('BAIXA'),
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

        if (cannot('abrir', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para abrir chamados.',
          )
        }

        const { titulo, descricao, prioridade, categoriaId, localId } =
          request.body

        const usuario = await prisma.usuario.findUnique({
          where: {
            id: usuarioId,
          },
          select: {
            nome: true,
          },
        })

        const chamado = await prisma.chamado.create({
          data: {
            titulo,
            descricao,
            prioridade,
            categoriaId,
            localId,
            abertoPor: usuarioId,
            logs: {
              create: {
                acao: 'ABRIR',
                usuarioId,
                descricao: `Chamado aberto por ${usuario?.nome}`,
              },
            },
          },
        })

        return reply.status(201).send({
          id: chamado.id,
        })
      },
    )
}

export { abrirChamado }

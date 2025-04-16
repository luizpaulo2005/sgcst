import { comentarioSchema } from '@sgcst/auth/src/models/comentario'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const adicionarComentario = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/chamados/:id/comentarios',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Adicionar comentário ao chamado',
          params: z.object({
            id: z.string().uuid(),
          }),
          body: z.object({
            comentario: z
              .string()
              .nonempty({ message: 'Comentário é obrigatório.' }),
          }),
          response: {
            201: z.object({
              id: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('criar', 'Comentario')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar comentários.',
          )
        }

        const { id } = request.params

        const chamado = await prisma.chamado.findUnique({
          where: { id },
        })

        if (!chamado) {
          throw new BadRequestError('Chamado não encontrado.')
        }

        if (
          cannot(
            'criar',
            comentarioSchema.parse({
              chamadoAbertoPor: chamado.abertoPor,
            }),
          )
        ) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar comentários neste chamado.',
          )
        }

        const { comentario } = request.body

        const novoComentario = await prisma.comentario.create({
          data: {
            comentario,
            chamadoId: id,
            usuarioId,
          },
        })

        await prisma.chamado.update({
          where: { id },
          data: {
            atualizadoEm: new Date(),
          },
        })

        return reply.status(201).send({
          id: novoComentario.id,
        })
      },
    )
}

export { adicionarComentario }

import { comentarioSchema } from '@sgcst/auth/src/models/comentario'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const editarComentario = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/chamados/:chamadoId/comentarios/:comentarioId',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Editar comentário de um chamado',
          security: [{ bearerAuth: [] }],
          params: z.object({
            chamadoId: z.string(),
            comentarioId: z.string(),
          }),
          body: z.object({
            texto: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        console.log(usuarioCargo)

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('atualizar', 'Comentario')) {
          throw new UnauthorizedError(
            'Você não tem permissão para editar comentários.',
          )
        }

        const { chamadoId, comentarioId } = request.params

        const chamado = await prisma.chamado.findUnique({
          where: { id: chamadoId },
        })

        if (!chamado) {
          throw new BadRequestError('Chamado não encontrado.')
        }

        const comentario = await prisma.comentario.findFirst({
          where: { AND: [{ id: comentarioId }, { chamadoId: chamado.id }] },
        })

        if (!comentario) {
          throw new BadRequestError('Comentário não encontrado.')
        }

        const validarComentario = {
          usuarioId: comentario.usuarioId,
          chamadoAbertoPor: chamado.abertoPor,
        }

        if (cannot('atualizar', comentarioSchema.parse(validarComentario))) {
          throw new UnauthorizedError(
            'Você não tem permissão para editar este comentário.',
          )
        }

        const { texto } = request.body

        await prisma.$transaction([
          prisma.comentario.update({
            where: { id: comentarioId },
            data: { comentario: texto },
          }),
          prisma.chamado.update({
            where: { id: chamadoId },
            data: {
              atualizadoEm: new Date(),
            },
          }),
        ])

        return reply.status(204).send()
      },
    )
}

export { editarComentario }

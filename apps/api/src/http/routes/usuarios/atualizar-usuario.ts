import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

const atualizarUsuario = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/atualizar-usuario',
      {
        schema: {
          tags: ['usuarios'],
          summary: 'Atualizar informações do usuário autenticado',
          security: [{ bearerAuth: [] }],
          body: z.object({
            nome: z.string().optional(),
            avatarUrl: z.string().url().nullable(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()

        const { nome, avatarUrl } = request.body

        await prisma.usuario.update({
          where: {
            id: usuarioId,
          },
          data: {
            nome,
            avatarUrl,
          },
        })

        return reply.status(204).send()
      },
    )
}

export { atualizarUsuario }

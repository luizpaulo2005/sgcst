import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const redefinirSenha = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/redefinir-senha',
    {
      schema: {
        tags: ['autenticacao'],
        summary: 'Redefinir senha',
        body: z.object({
          codigo: z.string(),
          senha: z.string().min(8),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { codigo, senha } = request.body

      const token = await prisma.token.findUnique({
        where: {
          id: codigo,
        },
      })

      if (!token) {
        throw new UnauthorizedError()
      }

      const dataAtual = new Date()

      if (dataAtual > token.validoAte) {
        throw new UnauthorizedError('Código expirado.')
      }

      const senhaHash = await hash(senha, 6)

      await prisma.$transaction([
        prisma.usuario.update({
          where: {
            id: token.usuarioId,
          },
          data: {
            senha: senhaHash,
          },
        }),

        prisma.token.delete({
          where: {
            id: codigo,
          },
        }),
      ])

      return reply.status(204).send()
    },
  )
}

export { redefinirSenha }

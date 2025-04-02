import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

const criarUsuario = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/usuario',
    {
      schema: {
        tags: ['autenticacao'],
        summary: 'Criar um novo usuário',
        body: z.object({
          nome: z.string(),
          email: z.string().email(),
          senha: z.string().min(8),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email, nome, senha } = request.body

      const user = await prisma.usuario.findUnique({
        where: {
          email,
        },
      })

      if (user) {
        throw new BadRequestError('Usuário com este e-mail já existe.')
      }

      await prisma.usuario.create({
        data: {
          nome,
          email,
          senha,
        },
      })

      reply.status(201).send()
    },
  )
}

export { criarUsuario }

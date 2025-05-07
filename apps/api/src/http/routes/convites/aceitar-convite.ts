import { env } from '@sgcst/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

const aceitarConvite = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/convites/:id/aceitar',
    {
      schema: {
        tags: ['convites'],
        summary: 'Aceitar convite',
        params: z.object({
          id: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const convite = await prisma.convite.findUnique({
        where: {
          id,
        },
      })

      if (!convite) {
        throw new BadRequestError('Convite não encontrado.')
      }

      // Remover o comentário abaixo permite que um usuário crie convites para usuários já existentes
      // const usuario = await prisma.usuario.findUnique({
      //   where: {
      //     email: convite.email,
      //   },
      // })

      // if (usuario) {
      //   throw new BadRequestError(
      //     'Usuário com esse e-mail já existe, não é possível aceitar o convite.',
      //   )
      // }

      await prisma.$transaction([
        prisma.usuario.upsert({
          where: {
            email: convite.email,
          },
          create: {
            email: convite.email,
            cargo: convite.cargo,
          },
          update: {
            cargo: convite.cargo,
          },
        }),

        prisma.convite.delete({
          where: {
            id,
          },
        }),
      ])

      return reply.redirect(env.WEB_URL + '/auth/login')
    },
  )
}

export { aceitarConvite }

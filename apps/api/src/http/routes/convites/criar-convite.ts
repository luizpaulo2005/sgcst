import { cargoSchema } from '@sgcst/auth/src/cargos'
import { env } from '@sgcst/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { mail } from '@/lib/nodemailer'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const criarConvite = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/convites',
      {
        schema: {
          tags: ['convites'],
          summary: 'Criar um novo convite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            cargo: cargoSchema,
          }),
          response: {
            201: z.object({
              conviteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('criar', 'Convite')) {
          throw new UnauthorizedError(
            'Você não tem permissão para criar convites.',
          )
        }

        const { cargo, email } = request.body

        const conviteExistente = await prisma.convite.findUnique({
          where: {
            email,
          },
        })

        if (conviteExistente) {
          throw new BadRequestError(
            'Já existe um convite para esse e-mail, revogue-o antes de criar um novo convite.',
          )
        }
        const usuario = await prisma.usuario.findUnique({
          where: {
            email,
          },
        })

        if (usuario && usuario.cargo === cargo) {
          throw new BadRequestError(
            'O cargo informado no convite é o mesmo cargo do usuário.',
          )
        }

        // Remover o comentário abaixo permite que um usuário crie convites para usuários já existentes
        // if (usuario) {
        //   throw new BadRequestError(
        //     'Esse e-mail já está cadastrado, utilize outro e-mail.',
        //   )
        // }

        const convite = await prisma.convite.create({
          data: {
            email,
            cargo,
            criadoPor: usuarioId,
          },
        })

        await mail.sendMail({
          from: 'SGCST',
          to: email,
          subject: `Convite para ser ${cargo}`,
          html: `Olá, você foi convidado para ser ${cargo} no SGCST. Clique <a href="${env.NEXT_PUBLIC_API_URL}/convites/${convite.id}/aceitar">aqui</a> para aceitar o convite e criar sua conta.`,
        })

        return reply.status(201).send({ conviteId: convite.id })
      },
    )
}

export { criarConvite }

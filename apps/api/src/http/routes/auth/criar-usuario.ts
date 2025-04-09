import { env } from '@sgcst/env'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { mail } from '@/lib/nodemailer'
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

      const senhaHash = await hash(senha, 6)

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
        },
      })

      let token = await prisma.token.findFirst({
        where: {
          usuarioId: usuario.id,
          tipo: 'VERIFICAR_EMAIL',
        },
      })

      if (!token) {
        token = await prisma.token.create({
          data: {
            tipo: 'VERIFICAR_EMAIL',
            usuarioId: usuario.id,
            validoAte: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        })
      }

      await mail.sendMail({
        from: 'SGCST',
        to: usuario.email,
        subject: 'Verificar e-mail',
        html: `Olá ${usuario.nome}, clique <a href="${env.NEXT_PUBLIC_API_URL}/auth/verificar-email?token=${token.id}">aqui</a> verificar seu e-mail. O link é válido por 24 horas.`,
      })

      reply.status(201).send()
    },
  )
}

export { criarUsuario }

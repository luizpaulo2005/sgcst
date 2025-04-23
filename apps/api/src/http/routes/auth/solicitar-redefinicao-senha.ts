import { env } from '@sgcst/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { mail } from '@/lib/nodemailer'
import { prisma } from '@/lib/prisma'

const solicitarRedefinicaoSenha = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/recuperar-senha',
    {
      schema: {
        tags: ['autenticacao'],
        summary: 'Solicitar redefinição de senha',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body

      const usuario = await prisma.usuario.findUnique({
        where: {
          email,
        },
      })

      if (!usuario) {
        return reply.status(201).send()
      }

      const token = await prisma.token.create({
        data: {
          tipo: 'RECUPERAR_SENHA',
          usuarioId: usuario.id,
          validoAte: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      })

      await mail.sendMail({
        from: 'SGCST',
        to: email,
        subject: 'Redefinir senha',
        html: `Olá ${usuario.nome}, clique <a href="${env.WEB_URL}/auth/definir-senha?token=${token.id}">aqui</a> redefinir sua senha. O link é válido por 24 horas.`,
      })

      return reply.status(201).send()
    },
  )
}

export { solicitarRedefinicaoSenha }

import { env } from '@sgcst/env'
import { compare } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { mail } from '@/lib/nodemailer'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const autenticarComSenha = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/senha',
    {
      schema: {
        tags: ['autenticacao'],
        summary: 'Autenticar com e-mail e senha',
        body: z.object({
          email: z.string().email(),
          senha: z.string().min(8),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, senha } = request.body

      const usuario = await prisma.usuario.findUnique({
        where: {
          email,
        },
      })

      if (!usuario) {
        throw new BadRequestError('Credenciais inválidas')
      }

      if (!usuario.ativo) {
        throw new UnauthorizedError(
          'Usuário inativo, entre em contato com os administradores',
        )
      }

      if (!usuario.senha) {
        const tokenExistente = await prisma.token.findFirst({
          where: {
            usuarioId: usuario.id,
            tipo: 'DEFINIR_SENHA',
          },
        })

        if (tokenExistente) {
          await prisma.token.delete({
            where: {
              id: tokenExistente.id,
            },
          })
        }

        const token = await prisma.token.create({
          data: {
            tipo: 'DEFINIR_SENHA',
            usuarioId: usuario.id,
            validoAte: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        })

        await mail.sendMail({
          from: 'SGCST',
          to: email,
          subject: 'Definir senha',
          html: `Olá ${usuario.email}, clique <a href="${env.WEB_URL}/auth/definir-senha?token=${token.id}">aqui</a> definir sua senha. O link é válido por 24 horas.`,
        })

        throw new BadRequestError(
          'Senha não definida, verifique o e-mail que foi usado para logar com o Google',
        )
      }

      const senhaValida = await compare(senha, usuario.senha)

      if (!senhaValida) {
        throw new BadRequestError('Credenciais inválidas')
      }

      const token = await reply.jwtSign(
        {
          sub: usuario.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(201).send({ token })
    },
  )
}

export { autenticarComSenha }

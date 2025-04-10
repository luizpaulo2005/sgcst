import { env } from '@sgcst/env'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const autenticarComGoogle = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/auth/google',
    {
      schema: {
        tags: ['autenticacao'],
        summary: 'Autenticar com Google',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const googleOauthURL = new URL('https://oauth2.googleapis.com/token')

      googleOauthURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
      googleOauthURL.searchParams.set(
        'client_secret',
        env.GOOGLE_OAUTH_CLIENT_SECRET,
      )
      googleOauthURL.searchParams.set(
        'redirect_uri',
        env.GOOGLE_OAUTH_REDIRECT_URI,
      )
      googleOauthURL.searchParams.set('code', code)
      googleOauthURL.searchParams.set('grant_type', 'authorization_code')

      const googleAccessTokenResponse = await fetch(googleOauthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const googleAccessTokenData = await googleAccessTokenResponse.json()

      const { access_token: googleAccessToken } = z
        .object({
          access_token: z.string(),
          expires_in: z.number(),
          scope: z.string(),
          token_type: z.literal('Bearer'),
          id_token: z.string(),
        })
        .parse(googleAccessTokenData)

      const googleUserResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      )

      const googleUserData = await googleUserResponse.json()

      const {
        sub,
        email,
        name,
        picture,
        email_verified: emailVerified,
      } = z
        .object({
          sub: z.string(),
          name: z.string(),
          email: z.string().email(),
          picture: z.string().url(),
          email_verified: z.boolean(),
        })
        .parse(googleUserData)

      let usuario = await prisma.usuario.findUnique({
        where: {
          email,
        },
      })

      if (!usuario) {
        usuario = await prisma.usuario.create({
          data: {
            googleId: sub,
            nome: name,
            email,
            avatarUrl: picture,
            emailVerificado: emailVerified,
          },
        })
      }

      if (!usuario.ativo) {
        throw new UnauthorizedError(
          'Usuário inativo, entre em contato com os administradores',
        )
      }

      await prisma.usuario.update({
        where: {
          id: usuario.id,
        },
        data: {
          nome: usuario.nome ?? name,
          googleId: sub,
          avatarUrl: usuario.avatarUrl ?? picture,
          emailVerificado: emailVerified,
        },
      })

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

export { autenticarComGoogle }

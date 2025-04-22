import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        throw new UnauthorizedError('Token inválido.')
      }
    }

    const usuarioId = await request.getCurrentUserId()

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId,
      },
    })

    if (!usuario) {
      throw new UnauthorizedError('Usuário não encontrado.')
    }

    if (!usuario.ativo) {
      throw new UnauthorizedError('Usuário inativo.')
    }

    request.getCurrentUserRole = async () => {
      const usuarioId = await request.getCurrentUserId()

      const usuario = await prisma.usuario.findFirst({
        where: {
          id: usuarioId,
        },
      })

      if (!usuario) {
        throw new UnauthorizedError('Usuário não encontrado.')
      }

      return usuario.cargo
    }
  })
})

export { auth }

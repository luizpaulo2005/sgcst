import { chamadoSchema } from '@sgcst/auth/src/models/chamado'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterChamadosPorUsuario = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/chamados/usuario',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Obter chamados abertos pelo usuário atual.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              chamados: z.array(
                z.object({
                  id: z.string(),
                  titulo: z.string(),
                  status: z.string(),
                  dataAbertura: z.date(),
                  abertoPor: z.string(),
                  categoria: z.object({
                    descricao: z.string(),
                  }),
                  local: z
                    .object({
                      nome: z.string(),
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('visualizar', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para acessar os chamados.',
          )
        }

        const chamados = await prisma.chamado.findMany({
          select: {
            id: true,
            titulo: true,
            status: true,
            dataAbertura: true,
            abertoPor: true,
            categoria: {
              select: {
                descricao: true,
              },
            },
            local: {
              select: {
                nome: true,
              },
            },
          },
          where: {
            abertoPor: usuarioId,
          },
          orderBy: {
            dataAbertura: 'desc',
          },
        })

        const chamadosFiltrados = chamados.filter((chamado) => {
          if (cannot('visualizar', chamadoSchema.parse(chamado))) {
            return false
          }

          return true
        })

        return { chamados: chamadosFiltrados }
      },
    )
}

export { obterChamadosPorUsuario }

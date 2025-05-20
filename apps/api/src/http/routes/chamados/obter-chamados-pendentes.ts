import { chamadoSchema } from '@sgcst/auth/src/models/chamado'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterChamadosPendentes = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/chamados/pendentes',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Obter chamados pendentes.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              chamados: z.array(
                z.object({
                  id: z.string(),
                  idPublico: z.number(),
                  titulo: z.string(),
                  status: z.string(),
                  prioridade: z.string(),
                  dataAbertura: z.date(),
                  abertoPor: z.string(),
                  categoria: z
                    .object({
                      descricao: z.string(),
                    })
                    .nullable(),
                  local: z.object({
                    nome: z.string(),
                  }),
                  usuario: z.object({
                    nome: z.string().nullable(),
                    email: z.string(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { can, cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('visualizar', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar chamados.',
          )
        }

        const chamados = await prisma.chamado.findMany({
          where: {
            AND: [
              { prioridade: { not: 'URGENTE' } },
              { status: { not: 'CANCELADO' } },
              { tecnico: null },
            ],
          },
          orderBy: [{ dataAbertura: 'desc' }],
          select: {
            id: true,
            idPublico: true,
            titulo: true,
            status: true,
            dataAbertura: true,
            abertoPor: true,
            prioridade: true,
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
            usuario: {
              select: {
                nome: true,
                email: true,
              },
            },
          },
        })

        const chamadosFiltrados = chamados.filter((chamado) => {
          if (can('visualizar', chamadoSchema.parse(chamado))) {
            return true
          }

          return false
        })

        return { chamados: chamadosFiltrados }
      },
    )
}

export { obterChamadosPendentes }

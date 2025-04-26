import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterChamadosUrgentesPendentes = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/chamados/urgentes',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Obter chamados urgentes pendentes.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              chamados: z.array(
                z.object({
                  id: z.string(),
                  titulo: z.string(),
                  status: z.string(),
                  prioridade: z.string(),
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

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('manage', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar chamados.',
          )
        }

        const chamados = await prisma.chamado.findMany({
          where: {
            AND: [{ prioridade: 'URGENTE' }, { tecnico: null }],
          },
          orderBy: [{ dataAbertura: 'desc' }],
          select: {
            id: true,
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

        return { chamados }
      },
    )
}

export { obterChamadosUrgentesPendentes }

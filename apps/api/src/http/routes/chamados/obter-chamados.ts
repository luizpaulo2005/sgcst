import { chamadoSchema } from '@sgcst/auth/src/models/chamado'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterChamados = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/chamados',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Obter Chamados',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              chamados: z.array(
                z.object({
                  id: z.string(),
                  idPublico: z.number().int(),
                  titulo: z.string(),
                  status: z.string(),
                  prioridade: z.string(),
                  abertoPor: z.string(),
                  usuario: z.object({
                    id: z.string(),
                    nome: z.string().nullable(),
                    email: z.string(),
                    avatarUrl: z.string().nullable(),
                  }),
                  dataAbertura: z.date(),
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot, can } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('visualizar', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar chamados.',
          )
        }

        const chamados = await prisma.chamado.findMany({
          orderBy: [{ dataAbertura: 'desc' }],
          select: {
            id: true,
            idPublico: true,
            titulo: true,
            status: true,
            prioridade: true,
            dataAbertura: true,
            abertoPor: true,
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        })

        const chamadosFiltrados = chamados.filter((chamado) =>
          can('visualizar', chamadoSchema.parse(chamado)),
        )

        return { chamados: chamadosFiltrados }
      },
    )
}

export { obterChamados }

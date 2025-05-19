import { chamadoSchema } from '@sgcst/auth/src/models/chamado'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const obterChamado = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/chamados/:id',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Obter Chamado por ID',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.coerce.number().int(),
          }),
          response: {
            200: z.object({
              chamado: z.object({
                id: z.string(),
                titulo: z.string(),
                descricao: z.string(),
                execucao: z.string().nullable(),
                status: z.string(),
                prioridade: z.string(),
                dataAbertura: z.date(),
                dataFechamento: z.date().nullable(),
                dataReabertura: z.date().nullable(),
                atualizadoEm: z.date(),
                fechadoPor: z.string().nullable(),
                abertoPor: z.string(),
                categoriaId: z.string().nullable(),
                localId: z.string().nullable(),
                usuario: z.object({
                  nome: z.string().nullable(),
                  email: z.string(),
                  avatarUrl: z.string().url().nullable(),
                }),
                categoria: z.object({ descricao: z.string() }).nullable(),
                local: z.object({ nome: z.string() }),
                tecnico: z
                  .object({
                    usuario: z.object({
                      nome: z.string().nullable(),
                      email: z.string(),
                      avatarUrl: z.string().url().nullable(),
                    }),
                  })
                  .nullable(),
                comentarios: z.array(
                  z.object({
                    id: z.string(),
                    comentario: z.string(),
                    usuario: z.object({
                      nome: z.string().nullable(),
                      avatarUrl: z.string().url().nullable(),
                    }),
                    criadoEm: z.date(),
                  }),
                ),
                logs: z.array(
                  z.object({
                    id: z.string(),
                    acao: z.string(),
                    descricao: z.string(),
                    dataHora: z.date(),
                    usuario: z.object({
                      nome: z.string().nullable(),
                      email: z.string(),
                      avatarUrl: z.string().url().nullable(),
                    }),
                  }),
                ),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { id } = request.params

        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('visualizar', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar chamados.',
          )
        }

        const chamado = await prisma.chamado.findUnique({
          where: {
            idPublico: id,
          },
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
                avatarUrl: true,
              },
            },
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
            tecnico: {
              select: {
                usuario: {
                  select: {
                    nome: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            comentarios: {
              select: {
                id: true,
                comentario: true,
                usuario: {
                  select: {
                    nome: true,
                    avatarUrl: true,
                  },
                },
                criadoEm: true,
              },
              orderBy: {
                criadoEm: 'desc',
              },
            },
            logs: {
              select: {
                id: true,
                acao: true,
                descricao: true,
                dataHora: true,
                usuario: {
                  select: {
                    nome: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
              orderBy: {
                dataHora: 'desc',
              },
            },
          },
        })

        if (!chamado) {
          throw new BadRequestError('Chamado não encontrado.')
        }

        if (cannot('visualizar', chamadoSchema.parse(chamado))) {
          throw new UnauthorizedError(
            'Você não tem permissão para visualizar este chamado.',
          )
        }

        return { chamado }
      },
    )
}

export { obterChamado }

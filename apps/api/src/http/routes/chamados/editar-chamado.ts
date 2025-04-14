import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

const editarChamado = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/chamados/:id',
      {
        schema: {
          tags: ['chamados'],
          summary: 'Editar Chamado',
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            titulo: z.string().optional(),
            descricao: z.string().optional(),
            execucao: z.string().optional(),
            status: z
              .enum([
                'NOVO',
                'ABERTO',
                'EM_ANDAMENTO',
                'EM_ESPERA',
                'VALIDANDO',
                'FECHADO',
                'CANCELADO',
              ])
              .optional(),
            prioridade: z
              .enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'])
              .optional(),
            localId: z.string().uuid().optional(),
            categoriaId: z.string().uuid().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const usuarioId = await request.getCurrentUserId()
        const usuarioCargo = await request.getCurrentUserRole()

        const { cannot } = getUserPermissions(usuarioId, usuarioCargo)

        if (cannot('atualizar', 'Chamado')) {
          throw new UnauthorizedError(
            'Você não tem permissão para editar chamados.',
          )
        }

        const { id } = request.params

        const chamado = await prisma.chamado.findUnique({
          where: { id },
        })

        if (!chamado) {
          throw new BadRequestError('Chamado não encontrado.')
        }

        if (chamado.status === 'CANCELADO') {
          throw new BadRequestError('Este chamado não pode ser editado.')
        }

        const body = request.body

        // Verificar diferenças e criar logs
        const logs: {
          usuarioId: string
          chamadoId: string
          acao: 'ABRIR' | 'FECHAR' | 'ALTERAR' | 'REABRIR' | 'CANCELAR'
          descricao: string
        }[] = []
        for (const [key, newValue] of Object.entries(body)) {
          const oldValue = chamado[key as keyof typeof chamado]
          if (newValue !== undefined && newValue !== oldValue) {
            logs.push({
              usuarioId,
              chamadoId: chamado.id,
              acao: 'ALTERAR',
              descricao: `O campo ${key} foi alterado de ${oldValue ?? 'nulo'} para ${newValue}`,
            })
          }
        }

        // Atualizar o chamado no banco
        await prisma.chamado.update({
          where: { id },
          data: {
            titulo: body.titulo,
            descricao: body.descricao,
            execucao: body.execucao,
            status: body.status,
            prioridade: body.prioridade,
            localId: body.localId,
            categoriaId: body.categoriaId,
          },
        })

        // Criar logs no banco
        if (logs.length > 0) {
          for (const log of logs) {
            await prisma.logChamado.create({
              data: {
                usuarioId: log.usuarioId,
                chamadoId: log.chamadoId,
                acao: log.acao,
                descricao: log.descricao,
              },
            })
          }
        }

        return reply.status(204).send()
      },
    )
}

export { editarChamado }

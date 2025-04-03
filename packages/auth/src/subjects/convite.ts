import { z } from 'zod'

const conviteSubject = z.tuple([
  z.union([
    z.literal('gerenciar'),
    z.literal('criar'),
    z.literal('visualizar'),
    z.literal('excluir'),
  ]),
  z.literal('Convite'),
])

type ConviteSubject = z.infer<typeof conviteSubject>

export { conviteSubject, type ConviteSubject }

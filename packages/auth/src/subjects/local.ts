import { z } from 'zod'

const localSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('criar'),
    z.literal('visualizar'),
    z.literal('atualizar'),
    z.literal('inativar'),
  ]),
  z.literal('Local'),
])
type LocalSubject = z.infer<typeof localSubject>

export { localSubject, type LocalSubject }

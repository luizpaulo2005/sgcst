import { z } from 'zod'

import { localSchema } from '../models/local'

const localSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('criar'),
    z.literal('visualizar'),
    z.literal('atualizar'),
    z.literal('inativar'),
  ]),
  z.union([z.literal('Local'), localSchema]),
])
type LocalSubject = z.infer<typeof localSubject>

export { localSubject, type LocalSubject }

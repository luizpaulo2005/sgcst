import { z } from 'zod'

import { comentarioSchema } from '../models/comentario'

const comentarioSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('criar'),
    z.literal('atualizar'),
    z.literal('remover'),
  ]),
  z.union([z.literal('Comentario'), comentarioSchema]),
])

type ComentarioSubject = z.infer<typeof comentarioSubject>

export { comentarioSubject, type ComentarioSubject }

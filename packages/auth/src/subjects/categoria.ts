import { z } from 'zod'

import { categoriaSchema } from '../models/categoria'

const categoriaSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('criar'),
    z.literal('visualizar'),
    z.literal('atualizar'),
    z.literal('inativar'),
  ]),
  z.union([z.literal('Categoria'), categoriaSchema]),
])

type CategoriaSubject = z.infer<typeof categoriaSubject>

export { categoriaSubject, type CategoriaSubject }

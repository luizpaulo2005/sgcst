import { z } from 'zod'

const categoriaSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('criar'),
    z.literal('visualizar'),
    z.literal('atualizar'),
    z.literal('inativar'),
  ]),
  z.literal('Categoria'),
])

type CategoriaSubject = z.infer<typeof categoriaSubject>

export { categoriaSubject, type CategoriaSubject }

import { z } from 'zod'

const usuarioSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('visualizar'),
    z.literal('atualizar'),
    z.literal('excluir'),
    z.literal('cancelar'),
  ]),
  z.literal('Usuario'),
])

type UsuarioSubject = z.infer<typeof usuarioSubject>

export { usuarioSubject, type UsuarioSubject }

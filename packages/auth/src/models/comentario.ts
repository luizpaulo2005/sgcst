import { z } from 'zod'

const comentarioSchema = z.object({
  __typename: z.literal('Comentario').default('Comentario'),
  usuarioId: z.string(),
  chamadoAbertoPor: z.string(),
})

type Comentario = z.infer<typeof comentarioSchema>

export { comentarioSchema, type Comentario }

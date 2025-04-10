import { z } from 'zod'

const categoriaSchema = z.object({
  __typename: z.literal('Categoria').default('Categoria'),
  ativo: z.boolean(),
})

type Categoria = z.infer<typeof categoriaSchema>

export { categoriaSchema, type Categoria }

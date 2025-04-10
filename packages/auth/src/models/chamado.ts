import { z } from 'zod'

const chamadoSchema = z.object({
  __typename: z.literal('Chamado').default('Chamado'),
  id: z.string(),
  abertoPor: z.string(),
})

type Chamado = z.infer<typeof chamadoSchema>

export { chamadoSchema, type Chamado }

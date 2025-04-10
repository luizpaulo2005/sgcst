import { z } from 'zod'

const localSchema = z.object({
  __typename: z.literal('Local').default('Local'),
  ativo: z.boolean(),
})

type Local = z.infer<typeof localSchema>

export { localSchema, type Local }

import { z } from 'zod'

import { cargoSchema } from '../cargos'

const usuarioSchema = z.object({
  id: z.string(),
  cargo: cargoSchema,
})

type Usuario = z.infer<typeof usuarioSchema>

export { usuarioSchema, type Usuario }

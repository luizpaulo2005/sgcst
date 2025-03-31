import { z } from 'zod'

const cargoSchema = z.union([
  z.literal('ADMINISTRADOR'),
  z.literal('TECNICO'),
  z.literal('USUARIO'),
])

type Cargo = z.infer<typeof cargoSchema>

export { cargoSchema, type Cargo }

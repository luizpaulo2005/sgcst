import { defineAbilityFor } from '@sgcst/auth'
import type { Cargo } from '@sgcst/auth/src/cargos'
import { usuarioSchema } from '@sgcst/auth/src/models/usuario'

const getUserPermissions = (usuarioId: string, cargo: Cargo) => {
  const usuarioAutenticado = usuarioSchema.parse({
    id: usuarioId,
    cargo,
  })

  const ability = defineAbilityFor(usuarioAutenticado)

  return ability
}

export { getUserPermissions }

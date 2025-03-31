import type { AbilityBuilder } from '@casl/ability'

import type { AppAbility } from '.'
import type { Cargo } from './cargos'
import type { Usuario } from './models/usuario'

type PermissoesPorCargo = (
  usuario: Usuario,
  builder: AbilityBuilder<AppAbility>,
) => void

const permissoes: Record<Cargo, PermissoesPorCargo> = {
  ADMINISTRADOR(_, { can }) {
    can('gerenciar', 'todos')
  },
  TECNICO(_, { can }) {
    can('gerenciar', 'Chamado')
  },
  USUARIO(usuario, { can }) {
    can('abrir', 'Chamado')
    can(['cancelar', 'visualizar'], 'Chamado', {
      abertoPor: { $eq: usuario.id },
    })
  },
}

export { permissoes }

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
    can('manage', 'all')
  },
  TECNICO(_, { can }) {
    can('manage', 'Chamado')
    can(['atualizar', 'visualizar'], ['Categoria', 'Local'], {
      ativo: { $eq: true },
    })
    can(['criar'], ['Categoria', 'Local'])
  },
  USUARIO(usuario, { can }) {
    can('abrir', 'Chamado')
    can(['cancelar', 'visualizar'], 'Chamado', {
      abertoPor: { $eq: usuario.id },
    })
    can('visualizar', ['Categoria', 'Local'], { ativo: { $eq: true } })
  },
}

export { permissoes }

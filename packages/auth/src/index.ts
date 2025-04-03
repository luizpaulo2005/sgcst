import {
  AbilityBuilder,
  type CreateAbility,
  createMongoAbility,
  type MongoAbility,
} from '@casl/ability'
import { z } from 'zod'

import type { Usuario } from './models/usuario'
import { permissoes } from './permissoes'
import { chamadoSubject } from './subjects/chamado'
import { conviteSubject } from './subjects/convite'
import { usuarioSubject } from './subjects/usuario'

export * from './permissoes'
export * from './subjects/chamado'
export * from './subjects/convite'
export * from './subjects/usuario'

const appAbilitiesSchema = z.union([
  usuarioSubject,
  chamadoSubject,
  conviteSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(usuario: Usuario) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissoes[usuario.cargo] !== 'function') {
    throw new Error(`Permissões para o cargo ${usuario.cargo} não encontrados.`)
  }

  permissoes[usuario.cargo](usuario, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}

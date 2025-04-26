'use client'

import { createMongoAbility, MongoAbility } from '@casl/ability'
import { createContext, useContext, useMemo } from 'react'

type AppAbility = MongoAbility

const permissoesIniciais = createMongoAbility([]) as AppAbility

const AbilityContext = createContext<AppAbility>(permissoesIniciais)

interface PermissoesProviderProps {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissoes: any[]
}

const PermissoesProvider = ({
  children,
  permissoes,
}: PermissoesProviderProps) => {
  const ability = useMemo(() => createMongoAbility(permissoes), [permissoes])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}

const useAbility = () => {
  const context = useContext(AbilityContext)
  if (!context) {
    throw new Error('useAbility precisa ser usado dentro de PermissoesProvider')
  }
  return context
}

export { PermissoesProvider, useAbility }

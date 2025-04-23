import { auth } from '@/auth/auth'

import { DropdownPerfil } from './dropdown-perfil'

const Perfil = async () => {
  const { usuario } = await auth()

  return <DropdownPerfil usuario={usuario} />
}

export { Perfil }

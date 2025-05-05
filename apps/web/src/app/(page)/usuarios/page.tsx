import { Loader2 } from 'lucide-react'

import { ability, auth } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'
import { obterUsuarios } from '@/http/obter-usuarios'

import { ListaUsuarios } from './lista-usuarios'

const Page = async () => {
  const permissoes = await ability()
  const { usuario } = await auth()

  if (permissoes.cannot('usuarios', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

  const { usuarios } = await obterUsuarios()

  if (!usuarios || !usuario) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-xl font-semibold">Nenhum usuário encontrado</h1>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuários</h1>
      </div>
      <ListaUsuarios usuarioAtualId={usuario.id} usuarios={usuarios} />
    </div>
  )
}

export default Page

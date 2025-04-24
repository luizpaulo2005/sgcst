import { Loader2 } from 'lucide-react'

import { auth } from '@/auth/auth'
import { obterMeusChamados } from '@/http/obter-meus-chamados'

import { ListaChamados } from '../../../components/lista-chamados'

const Page = async () => {
  const { chamados } = await obterMeusChamados()
  const {
    usuario: { id },
  } = await auth()

  if (!chamados) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  return (
    <ListaChamados idUsuarioAtual={id} chamados={chamados} mostrarUsuario />
  )
}

export default Page

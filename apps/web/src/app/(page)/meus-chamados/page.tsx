import { Loader2 } from 'lucide-react'

import { ability, auth } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'
import { obterMeusChamados } from '@/http/obter-meus-chamados'

import { ListaChamados } from '../../../components/lista-chamados'

const Page = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('meus-chamados', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

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

  return <ListaChamados idUsuarioAtual={id} chamados={chamados} />
}

export default Page

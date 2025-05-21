import { Loader2 } from 'lucide-react'

import { ability } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'
import { TabelaChamados } from '@/components/tabela-chamados'
import { obterMeusChamados } from '@/http/obter-meus-chamados'

const Page = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('meus-chamados', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

  const { chamados } = await obterMeusChamados()

  if (!chamados) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  return <TabelaChamados chamados={chamados} />
}

export default Page

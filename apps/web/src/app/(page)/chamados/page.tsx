import { Loader2 } from 'lucide-react'

import { ability } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'
import { obterChamados } from '@/http/obter-chamados'

import { ListaChamados } from './lista-chamados'

const Page = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('chamados', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

  const { chamados } = await obterChamados()

  if (!chamados) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (chamados.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-xl font-semibold">Nenhuma categoria encontrada</h1>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Chamados</h1>
      <ListaChamados chamados={chamados} />
    </div>
  )
}

export default Page

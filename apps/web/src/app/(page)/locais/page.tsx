import { Loader2 } from 'lucide-react'

import { ability } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'
import { obterLocais } from '@/http/obter-locais'

import { CriarLocal } from './criar-local'
import { ListaLocais } from './lista-locais'

const Page = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('locais', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

  const { locais } = await obterLocais()

  if (!locais) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (locais.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-xl font-semibold">Nenhum local encontrado.</h1>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Locais</h1>
        <CriarLocal />
      </div>
      <ListaLocais locais={locais} />
    </div>
  )
}

export default Page

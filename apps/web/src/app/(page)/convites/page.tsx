import { Loader2 } from 'lucide-react'

import { ability } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'
import { obterConvites } from '@/http/obter-convites'

import { CriarConvite } from './criar-convite'
import { ListaConvites } from './lista-convites'

const Page = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('convites', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

  const { convites } = await obterConvites()

  if (!convites) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Convites</h1>
        <CriarConvite />
      </div>
      {convites.length > 0 ? (
        <ListaConvites convites={convites} />
      ) : (
        <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
          <h1 className="text-xl font-semibold">Nenhum convite encontrado</h1>
        </div>
      )}
    </div>
  )
}

export default Page

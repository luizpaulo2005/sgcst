import { Loader2 } from 'lucide-react'

import { ability } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'
import { obterCategorias } from '@/http/obter-categorias'

import { CriarCategoria } from './criar-categoria'
import { ListaCategorias } from './lista-categorias'

const Page = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('categorias', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

  const { categorias } = await obterCategorias()

  if (!categorias) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (categorias.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-xl font-semibold">Nenhuma categoria encontrada</h1>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categorias</h1>
        <CriarCategoria />
      </div>
      <ListaCategorias categorias={categorias} />
    </div>
  )
}

export default Page

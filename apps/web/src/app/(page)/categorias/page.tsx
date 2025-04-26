import { Loader2 } from 'lucide-react'

import { obterCategorias } from '@/http/obter-categorias'

import { ListaCategorias } from './lista-categorias'

const Page = async () => {
  const { categorias } = await obterCategorias()

  if (!categorias) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  return <ListaCategorias categorias={categorias} />
}

export default Page

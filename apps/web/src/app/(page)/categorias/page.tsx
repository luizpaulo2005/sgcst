import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
        <Button variant="outline">
          <Plus />
          Nova Categoria
        </Button>
      </div>
      <div className="rounded-md border">
        <ListaCategorias categorias={categorias} />
      </div>
    </div>
  )
}

export default Page

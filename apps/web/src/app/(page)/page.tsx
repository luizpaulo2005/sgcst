import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'

import { ability } from '@/auth/auth'
import { ListaChamados } from '@/components/lista-chamados'
import { obterChamadosPendentes } from '@/http/obter-chamados-pendentes'
import { obterChamadosUrgentesPendentes } from '@/http/obter-chamados-urgentes-pendentes'

const App = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('painel', 'Acesso')) {
    return redirect('/meus-chamados')
  }

  const { chamados: chamadosUrgentesPendentes } =
    await obterChamadosUrgentesPendentes()
  const { chamados: chamadosPendentes } = await obterChamadosPendentes()

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Chamados urgentes pendentes</h1>
      {!chamadosUrgentesPendentes ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : chamadosUrgentesPendentes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-xl font-semibold">Nenhum chamado encontrado</h1>
        </div>
      ) : (
        <ListaChamados chamados={chamadosUrgentesPendentes} />
      )}
      <h1 className="text-xl font-semibold">Chamados pendentes</h1>
      {!chamadosPendentes ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : chamadosPendentes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <h1 className="text-xl font-semibold">Nenhum chamado encontrado</h1>
        </div>
      ) : (
        <ListaChamados chamados={chamadosPendentes} />
      )}
    </div>
  )
}

export default App

'use client'
import { redirect } from 'next/navigation'

import { useAbility } from '@/components/providers/permissoes'

const App = () => {
  const permissoes = useAbility()

  if (permissoes.cannot('painel', 'Acesso')) {
    return redirect('/meus-chamados')
  }

  return (
    <div>
      <h1>Page</h1>
    </div>
  )
}

export default App

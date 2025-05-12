import { redirect } from 'next/navigation'

import { ability, isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header/header'
import { PermissoesProvider } from '@/components/providers/permissoes'
import { SidebarProvider } from '@/components/providers/sidebar'
import { obterCategorias } from '@/http/obter-categorias'
import { obterLocais } from '@/http/obter-locais'

const AppLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  if (!(await isAuthenticated())) {
    redirect('/auth/login')
  }

  const permissoes = await ability()

  const { categorias } = await obterCategorias()
  const { locais } = await obterLocais()

  return (
    <PermissoesProvider permissoes={permissoes.rules}>
      <SidebarProvider>
        <div className="flex flex-1 flex-col gap-2 p-2">
          <Header categorias={categorias} locais={locais} />
          {children}
        </div>
      </SidebarProvider>
    </PermissoesProvider>
  )
}

export default AppLayout

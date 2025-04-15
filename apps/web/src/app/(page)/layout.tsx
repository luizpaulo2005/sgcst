import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header'
import { SidebarProvider } from '@/components/providers/sidebar'

const AppLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  if (!(await isAuthenticated())) {
    redirect('/auth/login')
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col gap-2 p-2">
        <Header />
        {children}
      </div>
    </SidebarProvider>
  )
}

export default AppLayout

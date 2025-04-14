import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

const AppLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  if (!(await isAuthenticated())) {
    redirect('/auth/login')
  }

  return <>{children}</>
}

export default AppLayout

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const header = await headers()
  const pathname = header.get('x-current-path')

  if ((await isAuthenticated()) && pathname !== '/auth/definir-senha') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {children}
    </div>
  )
}

export default AuthLayout

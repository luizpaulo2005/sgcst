import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  if (await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {children}
    </div>
  )
}

export default AuthLayout

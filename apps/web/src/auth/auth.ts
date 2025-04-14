import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { obterPerfil } from '@/http/obter-perfil'

const isAuthenticated = async () => {
  const cookie = await cookies()

  return !!cookie.get('token')?.value
}

const auth = async () => {
  const cookie = await cookies()

  const token = cookie.get('token')?.value

  if (!token) {
    redirect('/auth/login')
  }

  try {
    const { usuario } = await obterPerfil()

    return { usuario }
  } catch (error) {}

  redirect('/api/auth/sign-out')
}

export { auth, isAuthenticated }

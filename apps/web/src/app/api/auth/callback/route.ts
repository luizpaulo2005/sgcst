import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { autenticarComGoogle } from '@/http/autenticar-com-google'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Código do Google OAuth não encontrado.' },
      { status: 400 },
    )
  }

  const redirectUrl = request.nextUrl.clone()

  try {
    const { token } = await autenticarComGoogle({ code })

    const cookie = await cookies()

    cookie.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7days
    })

    redirectUrl.pathname = '/'
    redirectUrl.search = ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      redirectUrl.pathname = '/auth/login'
      redirectUrl.search = `?error=${encodeURIComponent(message)}`

      return NextResponse.redirect(redirectUrl)
    }

    redirectUrl.pathname = '/auth/login'
    redirectUrl.search = `?error=${encodeURIComponent(error.message)}`

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.redirect(redirectUrl)
}

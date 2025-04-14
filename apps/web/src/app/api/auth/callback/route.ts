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

  const { token } = await autenticarComGoogle({ code })

  const cookie = await cookies()

  cookie.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7days
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'
  redirectUrl.search = ''

  return NextResponse.redirect(redirectUrl)
}

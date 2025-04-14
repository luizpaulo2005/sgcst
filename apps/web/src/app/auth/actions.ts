'use server'

import { env } from '@sgcst/env'
import { redirect } from 'next/navigation'

const autenticarComGoogle = async () => {
  const autenticarComGoogleURL = new URL(
    'o/oauth2/v2/auth',
    'https://accounts.google.com',
  )

  autenticarComGoogleURL.searchParams.set(
    'client_id',
    env.GOOGLE_OAUTH_CLIENT_ID,
  )
  autenticarComGoogleURL.searchParams.set(
    'redirect_uri',
    env.GOOGLE_OAUTH_REDIRECT_URI,
  )
  autenticarComGoogleURL.searchParams.set('response_type', 'code')
  autenticarComGoogleURL.searchParams.set('scope', 'email profile')

  redirect(autenticarComGoogleURL.toString())
}

export { autenticarComGoogle }

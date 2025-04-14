import { api } from './api-client'

interface AutenticarComGoogleRequest {
  code: string
}

interface AutenticarComGoogleResponse {
  token: string
}

const autenticarComGoogle = async ({ code }: AutenticarComGoogleRequest) => {
  const result = await api
    .post('auth/google', {
      json: {
        code,
      },
    })
    .json<AutenticarComGoogleResponse>()

  return result
}

export { autenticarComGoogle }

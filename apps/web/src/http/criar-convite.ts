import { api } from './api-client'

interface CriarConviteRequest {
  email: string
  cargo: string
}

const criarConvite = async ({ email, cargo }: CriarConviteRequest) => {
  const result = await api.post<void>('convites', {
    json: {
      email,
      cargo,
    },
  })

  return result
}

export { criarConvite }

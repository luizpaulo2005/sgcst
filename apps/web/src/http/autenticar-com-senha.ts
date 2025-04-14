import { api } from './api-client'

interface AutenticarComSenhaRequest {
  email: string
  senha: string
}

interface AutenticarComSenhaResponse {
  token: string
}

const autenticarComSenha = async ({
  email,
  senha,
}: AutenticarComSenhaRequest) => {
  const result = await api
    .post('auth/senha', {
      json: {
        email,
        senha,
      },
    })
    .json<AutenticarComSenhaResponse>()

  return result
}

export { autenticarComSenha }

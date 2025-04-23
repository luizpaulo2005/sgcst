import { api } from './api-client'

interface SolicitarRedefinicaoSenhaRequest {
  email: string
}

const solicitarRedefinicaoSenha = async ({
  email,
}: SolicitarRedefinicaoSenhaRequest) => {
  await api
    .post('auth/recuperar-senha', {
      json: {
        email,
      },
    })
    .json<void>()
}

export { solicitarRedefinicaoSenha }

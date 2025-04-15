import { api } from './api-client'

interface DefinirSenhaRequest {
  codigo: string
  senha: string
}

type DefinirSenhaResponse = void

const definirSenha = async ({
  codigo,
  senha,
}: DefinirSenhaRequest): Promise<DefinirSenhaResponse> => {
  await api.post('auth/redefinir-senha', {
    json: {
      codigo,
      senha,
    },
  })
}

export { definirSenha }

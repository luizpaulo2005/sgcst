import { api } from './api-client'

interface CriarUsuarioRequest {
  nome: string
  email: string
  senha: string
}

type CriarUsuarioResponse = void

const criarUsuario = async ({
  nome,
  email,
  senha,
}: CriarUsuarioRequest): Promise<CriarUsuarioResponse> => {
  await api.post('usuario', {
    json: {
      nome,
      email,
      senha,
    },
  })
}

export { criarUsuario }

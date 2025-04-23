import { api } from './api-client'

interface AtualizarUsuarioRequest {
  nome: string
  avatarUrl?: string | null
}

type AtualizarUsuarioResponse = void

const atualizarUsuario = async ({
  nome,
  avatarUrl,
}: AtualizarUsuarioRequest): Promise<AtualizarUsuarioResponse> => {
  await api.put('atualizar-usuario', {
    json: {
      nome,
      avatarUrl,
    },
  })
}

export { atualizarUsuario }

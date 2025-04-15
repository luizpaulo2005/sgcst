import { api } from './api-client'

interface ObterPerfilResponse {
  usuario: {
    id: string
    nome: string | null
    email: string
    avatarUrl: string | null
  }
}

const obterPerfil = async () => {
  const result = await api.get('perfil').json<ObterPerfilResponse>()

  return result
}

export { obterPerfil }

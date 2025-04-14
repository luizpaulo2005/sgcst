import { api } from './api-client'

interface ObterPerfilResponse {
  usuario: {
    name: string | null
    id: string
    avatarUrl: string | null
    email: string
  } | null
}

const obterPerfil = async () => {
  const result = await api.get('perfil').json<ObterPerfilResponse>()

  return result
}

export { obterPerfil }

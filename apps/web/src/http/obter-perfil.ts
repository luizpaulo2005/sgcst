import { api } from './api-client'

interface ObterPerfilResponse {
  usuario: {
    id: string
    nome: string | null
    email: string
    avatarUrl: string | null
    cargo: 'ADMINISTRADOR' | 'TECNICO' | 'USUARIO'
    emailVerificado: boolean
  }
}

const obterPerfil = async () => {
  const result = await api
    .get('perfil', {
      next: {
        tags: ['usuario'],
      },
    })
    .json<ObterPerfilResponse>()

  return result
}

export { obterPerfil }

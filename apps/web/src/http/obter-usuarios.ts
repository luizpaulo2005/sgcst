import { api } from './api-client'

interface ObterUsuariosResponse {
  usuarios: Array<{
    id: string
    nome: string | null
    email: string
    avatarUrl: string | null
    ativo: boolean
    cargo: 'ADMINISTRADOR' | 'TECNICO'
  }>
}

const obterUsuarios = async () => {
  const result = await api
    .get('usuarios', {
      next: {
        tags: ['usuarios'],
      },
    })
    .json<ObterUsuariosResponse>()

  return result
}

export { obterUsuarios }

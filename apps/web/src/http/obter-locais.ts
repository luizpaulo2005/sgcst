import { api } from './api-client'

interface ObterLocaisResponse {
  locais: Array<{
    id: string
    nome: string
    avatarUrl?: string
    ativo?: boolean
  }>
}

const obterLocais = async () => {
  const result = await api
    .get('locais', {
      next: {
        tags: ['locais'],
      },
    })
    .json<ObterLocaisResponse>()

  return result
}

export { obterLocais }

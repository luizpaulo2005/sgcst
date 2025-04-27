import { api } from './api-client'

interface CriaCategoriaRequest {
  descricao: string
}

type CriaCategoriaResponse = void

const criarCategoria = async ({ descricao }: CriaCategoriaRequest) => {
  const result = await api.post<CriaCategoriaResponse>('categorias', {
    json: {
      descricao,
    },
  })

  return result
}

export { criarCategoria }

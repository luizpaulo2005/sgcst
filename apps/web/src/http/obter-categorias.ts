import { api } from './api-client'

interface ObterCategoriasResponse {
  categorias: Array<{
    id: string
    descricao: string
    ativo?: boolean
  }>
}

const obterCategorias = async () => {
  const result = await api.get('categorias').json<ObterCategoriasResponse>()

  return result
}

export { obterCategorias }

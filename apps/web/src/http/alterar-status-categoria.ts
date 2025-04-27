import { api } from './api-client'

interface AlterarStatusCategoriaRequest {
  id: string
}

type AlterarStatusCategoriaResponse = void

const alterarStatusCategoria = async ({
  id,
}: AlterarStatusCategoriaRequest) => {
  const result = await api.patch<AlterarStatusCategoriaResponse>(
    `categorias/${id}/status`,
  )

  return result
}

export { alterarStatusCategoria }

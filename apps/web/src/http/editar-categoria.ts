import { api } from './api-client'

interface EditarCategoriaRequest {
  id: string
  descricao: string
}

type EditarCategoriaResponse = void

const editarCategoria = async ({
  id,
  descricao,
}: EditarCategoriaRequest): Promise<EditarCategoriaResponse> => {
  await api.put(`categorias/${id}`, {
    json: {
      descricao,
    },
  })
}

export { editarCategoria }

import { api } from './api-client'

interface EditarLocalRequest {
  id: string
  nome: string
  avatarUrl?: string | null
}

type EditarLocalResponse = void

const editarLocal = async ({
  id,
  nome,
  avatarUrl,
}: EditarLocalRequest): Promise<EditarLocalResponse> => {
  await api.put(`locais/${id}`, {
    json: {
      nome,
      avatarUrl,
    },
  })
}

export { editarLocal }

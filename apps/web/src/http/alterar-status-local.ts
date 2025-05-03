import { api } from './api-client'

interface AlterarStatusLocalRequest {
  id: string
}

type AlterarStatusLocalResponse = void

const alterarStatusLocal = async ({ id }: AlterarStatusLocalRequest) => {
  const result = await api.patch<AlterarStatusLocalResponse>(
    `locais/${id}/status`,
  )

  return result
}

export { alterarStatusLocal }

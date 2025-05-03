import { api } from './api-client'

interface CriaLocalRequest {
  nome: string
  avatarUrl?: string | null
}

type CriaLocalResponse = void

const criarLocal = async ({ nome, avatarUrl }: CriaLocalRequest) => {
  const result = await api.post<CriaLocalResponse>('locais', {
    json: {
      nome,
      avatarUrl,
    },
  })

  return result
}

export { criarLocal }

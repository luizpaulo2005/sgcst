import { api } from './api-client'

interface ObterConvitesResponse {
  convites: Array<{
    id: string
    email: string
    cargo: 'ADMINISTRADOR' | 'TECNICO'
    criadoEm: Date
  }>
}

const obterConvites = async () => {
  const result = await api.get('convites').json<ObterConvitesResponse>()

  return result
}

export { obterConvites }

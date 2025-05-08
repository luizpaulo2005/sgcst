import { api } from './api-client'

interface RevogarConviteRequest {
  id: string
}

const revogarConvite = async ({ id }: RevogarConviteRequest) => {
  const result = await api.delete<void>(`convites/${id}`)

  return result
}

export { revogarConvite }

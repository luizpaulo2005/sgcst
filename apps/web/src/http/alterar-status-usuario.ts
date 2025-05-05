import { api } from './api-client'

interface alterarStatusUsuarioRequest {
  id: string
}

const alterarStatusUsuario = async ({ id }: alterarStatusUsuarioRequest) => {
  await api.patch(`usuarios/${id}/status`).json<void>()
}

export { alterarStatusUsuario }

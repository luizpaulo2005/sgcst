import { api } from './api-client'

const solicitarVerificacaoEmail = async () => {
  await api.post('auth/solicitar-verificacao-email').json<void>()
}

export { solicitarVerificacaoEmail }

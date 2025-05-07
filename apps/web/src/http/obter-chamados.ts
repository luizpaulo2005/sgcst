import { api } from './api-client'

interface ObterChamadosResponse {
  chamados: Array<{
    id: string
    idPublico: number
    titulo: string
    status:
      | 'NOVO'
      | 'ABERTO'
      | 'EM_ANDAMENTO'
      | 'EM_ESPERA'
      | 'VALIDANDO'
      | 'FECHADO'
      | 'CANCELADO'
    prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
    dataAbertura: Date
    abertoPor: string
    usuario: {
      id: string
      nome: string | null
      email: string
      avatarUrl: string | null
    }
  }>
}

const obterChamados = async () => {
  const result = await api
    .get('chamados', {
      next: {
        tags: ['chamados'],
      },
    })
    .json<ObterChamadosResponse>()

  return result
}

export { obterChamados }

import { api } from './api-client'

interface ObterChamadosPendentesResponse {
  chamados: {
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
    categoria: {
      descricao: string
    } | null
    local: {
      nome: string
    }
    usuario: {
      id: string
      nome: string | null
      email: string
      avatarUrl: string | null
    }
  }[]
}

const obterChamadosPendentes = async () => {
  const result = await api
    .get('chamados/pendentes', {
      next: {
        tags: ['chamado'],
        revalidate: 0,
      },
    })
    .json<ObterChamadosPendentesResponse>()

  return result
}

export { obterChamadosPendentes }

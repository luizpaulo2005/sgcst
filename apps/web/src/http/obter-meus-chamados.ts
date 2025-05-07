import { api } from './api-client'

interface ObterMeusChamadosResponse {
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
    dataAbertura: string
    abertoPor: string
    categoria: {
      descricao: string
    }
    local: {
      nome: string
    } | null
    usuario: {
      nome: string | null
      email: string
    }
  }[]
}

const obterMeusChamados = async () => {
  const result = await api
    .get('chamados/usuario', {
      next: {
        tags: ['chamado'],
      },
    })
    .json<ObterMeusChamadosResponse>()

  return result
}

export { obterMeusChamados }

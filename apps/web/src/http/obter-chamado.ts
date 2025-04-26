import { api } from './api-client'

interface ObterChamadoRequest {
  id: string
}

interface ObterChamadoResponse {
  chamado: {
    id: string
    titulo: string
    descricao: string
    execucao: string | null
    status: string
    prioridade: string
    dataAbertura: Date
    dataFechamento: Date | null
    dataReabertura: Date | null
    atualizadoEm: Date
    fechadoPor: string | null
    abertoPor: string
    categoriaId: string
    localId: string | null
    usuario: {
      nome: string | null
      email: string
      avatarUrl: string | null
    }
    categoria: {
      descricao: string
    }
    local: {
      nome: string
    } | null
    tecnico: {
      usuario: {
        nome: string | null
        email: string
        avatarUrl: string | null
      }
    } | null
    comentarios: Array<{
      id: string
      comentario: string
      usuario: {
        nome: string | null
        avatarUrl: string | null
      }
      criadoEm: Date
    }>
    logs: Array<{
      id: string
      acao: string
      descricao: string
      dataHora: Date
      usuario: {
        nome: string | null
        email: string
        avatarUrl: string | null
      }
    }>
  }
}

const obterChamado = async ({ id }: ObterChamadoRequest) => {
  const result = await api.get(`chamados/${id}`).json<ObterChamadoResponse>()

  return result
}

export { obterChamado }

import { api } from './api-client'

interface CriarChamadoRequest {
  titulo: string
  descricao?: string | null
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  categoriaId?: string | null
  localId: string
}

type CriarChamadoResponse = {
  id: string
}

const criarChamado = async (data: CriarChamadoRequest) => {
  const result = await api.post<CriarChamadoResponse>('chamados', {
    json: {
      ...data,
    },
  })

  return result
}

export { criarChamado }

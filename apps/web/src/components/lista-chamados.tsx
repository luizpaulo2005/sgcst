import { Loader2 } from 'lucide-react'

import { CardChamado } from './card-chamado'

interface Chamado {
  id: string
  titulo: string
  status:
    | 'NOVO'
    | 'ABERTO'
    | 'EM_ANDAMENTO'
    | 'EM_ESPERA'
    | 'VALIDANDO'
    | 'FECHADO'
    | 'CANCELADO'
  dataAbertura: string
  abertoPor: string
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
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
  tecnico?: {
    usuario: {
      nome: string | null
      email: string
      avatarUrl: string | null
    }
  } | null
}

interface ListaChamadoProps {
  idUsuarioAtual?: string
  mostrarUsuario?: boolean
  chamados: Chamado[]
}

const ListaChamados = ({
  idUsuarioAtual,
  mostrarUsuario,
  chamados,
}: ListaChamadoProps) => {
  if (!chamados) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )
  }

  if (chamados.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Nenhum chamado encontrado.
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {chamados.map((chamado) => {
        return (
          <CardChamado
            key={chamado.id}
            chamado={chamado}
            mostrarUsuario={mostrarUsuario}
            idUsuarioAtual={idUsuarioAtual}
          />
        )
      })}
    </div>
  )
}

export { ListaChamados }

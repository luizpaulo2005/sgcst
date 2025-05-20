'use client'

import { Loader2 } from 'lucide-react'
import { useState } from 'react'

import { CardChamado } from './card-chamado'
import { Button } from './ui/button'

interface Chamado {
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
  dataAbertura: Date
  abertoPor: string
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  categoria: {
    descricao: string
  } | null
  local: {
    nome: string
  }
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
  const [mostrarMais, setMostrarMais] = useState(false)

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

  const chamadosExibidos = mostrarMais ? chamados : chamados.slice(0, 4)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-stretch gap-2">
        {chamadosExibidos.map((chamado) => {
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
      {chamados.length > 4 && (
        <Button
          className="-mr-2 self-end"
          variant="link"
          onClick={() => setMostrarMais(!mostrarMais)}
        >
          Mostrar {mostrarMais ? 'menos' : 'mais'}
        </Button>
      )}
    </div>
  )
}

export { ListaChamados }

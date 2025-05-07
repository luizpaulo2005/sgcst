'use client'

import clsx from 'clsx'
import { Ban } from 'lucide-react'
import Link from 'next/link'

import { Card } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'
import { dayjs } from '@/lib/dayjs'

import { useAbility } from './providers/permissoes'
import { Button } from './ui/button'

interface CardChamadoProps {
  idUsuarioAtual?: string
  mostrarUsuario?: boolean
  chamado: {
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
}

const statusChamado = {
  NOVO: 'Novo',
  ABERTO: 'Aberto',
  EM_ANDAMENTO: 'Em Andamento',
  EM_ESPERA: 'Em Espera',
  VALIDANDO: 'Validando',
  FECHADO: 'Fechado',
  CANCELADO: 'Cancelado',
}

const getClassesPrioridade = (prioridade: string) => {
  switch (prioridade) {
    case 'BAIXA':
      return { bg: 'bg-emerald-500', text: 'text-emerald-500' }
    case 'MEDIA':
      return { bg: 'bg-yellow-500', text: 'text-yellow-500' }
    case 'ALTA':
      return { bg: 'bg-orange-500', text: 'text-orange-500' }
    case 'URGENTE':
      return { bg: 'bg-red-500', text: 'text-red-500' }
    default:
      return { bg: 'bg-gray-500', text: 'text-gray-500' }
  }
}

const CardChamado = ({
  idUsuarioAtual,
  chamado,
  mostrarUsuario,
}: CardChamadoProps) => {
  const permissoes = useAbility()
  const isMobile = useIsMobile()
  const classes = getClassesPrioridade(chamado.prioridade)

  const cardClasses = clsx(
    'w-full p-4 flex flex-col justify-between gap-2',
    isMobile ? 'max-w-full' : 'max-w-sm',
  )

  return (
    <Card className={cardClasses}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/chamados/${chamado.idPublico}`}
            data-cancelado={chamado.status === 'CANCELADO'}
            className="visited:text-secondary-foreground data-[cancelado=true]:text-muted-foreground block truncate text-xl font-semibold hover:underline data-[cancelado=true]:line-through"
          >
            {chamado.titulo}
          </Link>
          <p className="text-xs">{statusChamado[chamado.status]}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`size-3 ${classes.bg} rounded-full`} />
          <p className={`${classes.text} text-sm`}>{chamado.prioridade}</p>
        </div>
      </div>
      <div className="text-sm">
        <p>{chamado.categoria.descricao}</p>
        <p className="truncate">
          Local: {chamado.local ? chamado.local.nome : 'Não informado'}
        </p>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="truncate text-end text-xs">
          Aberto {dayjs().to(chamado.dataAbertura)}{' '}
          {mostrarUsuario &&
            `por ${chamado.usuario.nome ?? chamado.usuario.email}`}
        </p>
        {permissoes.can('manage', 'Chamado') &&
          !chamado.tecnico &&
          idUsuarioAtual !== chamado.abertoPor && (
            <Button size="sm" variant="outline">
              Assumir
            </Button>
          )}
        {idUsuarioAtual === chamado.abertoPor &&
          !chamado.tecnico &&
          !['FECHADO', 'CANCELADO'].includes(chamado.status) && (
            <Button size="sm" variant="destructive">
              <Ban />
              Cancelar
            </Button>
          )}
      </div>
    </Card>
  )
}

export { CardChamado }

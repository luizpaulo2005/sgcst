'use client'

import { dayjs } from '@/lib/dayjs'

interface DetalhesChamadoProps {
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

const DetalhesChamado = ({ chamado }: DetalhesChamadoProps) => {
  return (
    <div className="space-y-2">
      <h1 className="truncate text-3xl font-semibold">{chamado.titulo}</h1>
      <p className="flex items-center gap-2 text-sm">
        Aberto {dayjs().to(chamado.dataAbertura)} por{' '}
        <div className="flex items-center gap-2">
          {chamado.usuario.avatarUrl && (
            <img
              className="size-4 rounded-full"
              src={chamado.usuario.avatarUrl}
              alt=""
            />
          )}
          {chamado.usuario.nome ?? chamado.usuario.email}
        </div>
      </p>

      <p className="text-sm">Descrição: {chamado.descricao}</p>
      <p className="text-sm">
        Local: {chamado.local ? chamado.local.nome : 'Não informado'}
      </p>
      <p className="text-sm">Categoria: {chamado.categoria.descricao}</p>
    </div>
  )
}

export { DetalhesChamado }

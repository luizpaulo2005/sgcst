'use client'

import { Search, Trash } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { obterIniciais } from '@/components/header/perfil/dropdown-perfil'
import { Paginacao } from '@/components/paginacao'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { dayjs } from '@/lib/dayjs'

interface ListaChamadosProps {
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

const ListaChamados = ({ chamados }: ListaChamadosProps) => {
  const isMobile = useIsMobile()

  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [idFiltro, setIdFiltro] = useState('')
  const [idInput, setIdInput] = useState('')
  const [tituloFiltro, setTituloFiltro] = useState('')
  const [tituloInput, setTituloInput] = useState('')

  const chamadosFiltrados = chamados.filter((chamado) => {
    const matchesStatus =
      statusFiltro === '' ||
      (statusFiltro === 'NOVO' && chamado.status === 'NOVO') ||
      (statusFiltro === 'ABERTO' && chamado.status === 'ABERTO') ||
      (statusFiltro === 'EM_ANDAMENTO' && chamado.status === 'EM_ANDAMENTO') ||
      (statusFiltro === 'EM_ESPERA' && chamado.status === 'EM_ESPERA') ||
      (statusFiltro === 'VALIDANDO' && chamado.status === 'VALIDANDO') ||
      (statusFiltro === 'FECHADO' && chamado.status === 'FECHADO') ||
      (statusFiltro === 'CANCELADO' && chamado.status === 'CANCELADO') ||
      (statusFiltro === 'todos' && true)

    const matchesId =
      idFiltro === '' ||
      (chamado.idPublico &&
        chamado.idPublico.toString().includes(idFiltro.toString()))

    const matchesTitulo =
      tituloFiltro === '' ||
      (chamado.titulo &&
        chamado.titulo.toLowerCase().includes(tituloFiltro.toLowerCase()))

    return matchesStatus && matchesId && matchesTitulo
  })

  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  const indiceUltimoItem = paginaAtual * itensPorPagina
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina
  const chamadosPaginados = chamadosFiltrados.slice(
    indicePrimeiroItem,
    indiceUltimoItem,
  )

  useEffect(() => {
    setPaginaAtual(1)
  }, [itensPorPagina, statusFiltro, idFiltro, tituloFiltro])

  console.log(chamados)
  console.log(chamadosFiltrados)
  console.log(chamadosPaginados)

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder="ID do Chamado"
          className="max-w-80"
          disabled={idFiltro !== ''}
        />
        <Input
          value={tituloInput}
          onChange={(e) => setTituloInput(e.target.value)}
          placeholder="Título do Chamado"
          className="max-w-80"
          disabled={tituloFiltro !== ''}
        />
        {idFiltro !== '' || tituloFiltro !== '' ? (
          <Button
            onClick={() => {
              setIdFiltro('')
              setIdInput('')
              setTituloFiltro('')
              setTituloInput('')
            }}
            variant="destructive"
          >
            <Trash />
            {!isMobile && 'Limpar'}
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIdFiltro(idInput)
              setTituloFiltro(tituloInput)
            }}
            variant="secondary"
          >
            <Search />
            {!isMobile && 'Buscar'}
          </Button>
        )}
        <span>Status: </span>
        <Select value={statusFiltro} onValueChange={setStatusFiltro}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusChamado).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border p-px">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px] whitespace-nowrap">
                ID
              </TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="min-w-[100px] whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="min-w-[110px] whitespace-nowrap">
                Prioridade
              </TableHead>
              <TableHead className="min-w-[130px] whitespace-nowrap">
                Data de Abertura
              </TableHead>
              <TableHead>Aberto Por</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chamadosPaginados.map((chamado) => {
              const classes = getClassesPrioridade(chamado.prioridade)

              return (
                <TableRow key={chamado.id}>
                  <TableCell>{chamado.idPublico}</TableCell>
                  <TableCell className="w-full max-w-0">
                    <Link
                      className="visited:text-muted-foreground block break-words whitespace-normal hover:underline md:truncate"
                      href={`/chamados/${chamado.idPublico}`}
                      title={chamado.titulo}
                    >
                      {chamado.titulo}
                    </Link>
                  </TableCell>
                  <TableCell>{statusChamado[chamado.status]}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`size-3 ${classes.bg} rounded-full`} />
                      <p className={`${classes.text} text-sm`}>
                        {chamado.prioridade}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{dayjs().to(chamado.dataAbertura)}</TableCell>
                  <TableCell className="w-full">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6 shrink-0">
                        {chamado.usuario.avatarUrl && (
                          <AvatarImage src={chamado.usuario.avatarUrl} />
                        )}
                        <AvatarFallback>
                          {obterIniciais(
                            chamado.usuario.nome ?? chamado.usuario.email,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-px break-words whitespace-normal md:truncate">
                        <p className="font-semibold">
                          {chamado.usuario.nome ?? 'Nome não informado'}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {chamado.usuario.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          <Paginacao
            itensPorPagina={itensPorPagina}
            paginaAtual={paginaAtual}
            total={chamadosFiltrados.length}
            setPaginaAtual={setPaginaAtual}
            setItensPorPagina={setItensPorPagina}
          />
        </Table>
      </div>
    </div>
  )
}

export { ListaChamados }

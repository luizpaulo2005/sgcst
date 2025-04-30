'use client'

import { Ban, Pen, Power, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Paginacao } from '@/components/paginacao'
import { useAbility } from '@/components/providers/permissoes'
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

interface ListaLocaisProps {
  locais: Array<{
    id: string
    nome: string
    avatarUrl?: string
    ativo?: boolean
  }>
}

const ListaLocais = ({ locais }: ListaLocaisProps) => {
  const permissoes = useAbility()
  const isMobile = useIsMobile()
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [valorBusca, setValorBusca] = useState('')
  const [inputBusca, setInputBusca] = useState('')

  const locaisFiltrados = locais.filter((local) => {
    const matchesBusca =
      valorBusca === '' ||
      local.nome.toLowerCase().includes(valorBusca.toLowerCase())

    const matchesStatus =
      statusFiltro === 'todos' ||
      (statusFiltro === 'ativos' && local.ativo) ||
      (statusFiltro === 'inativos' && !local.ativo)

    return matchesBusca && matchesStatus
  })

  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  const indiceUltimoItem = paginaAtual * itensPorPagina
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina
  const locaisPaginados = locaisFiltrados.slice(
    indicePrimeiroItem,
    indiceUltimoItem,
  )

  useEffect(() => {
    setPaginaAtual(1)
  }, [itensPorPagina, statusFiltro, valorBusca])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={inputBusca}
          onChange={(e) => setInputBusca(e.target.value)}
          className="max-w-80"
          placeholder="Busque pelo nome"
        />
        {valorBusca !== '' ? (
          <Button
            onClick={() => {
              setValorBusca('')
              setInputBusca('')
            }}
            variant="destructive"
          >
            <Trash />
            {!isMobile && 'Limpar'}
          </Button>
        ) : (
          <Button onClick={() => setValorBusca(inputBusca)} variant="secondary">
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
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border p-px">
        <Table>
          <TableHeader>
            <TableRow>
              {permissoes.can('manage', 'Local') && <TableHead>ID</TableHead>}
              <TableHead>Nome</TableHead>
              {permissoes.can('manage', 'Local') && (
                <TableHead>Status</TableHead>
              )}
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locaisPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            )}
            {locaisPaginados.map((local) => (
              <TableRow key={local.id}>
                {permissoes.can('manage', 'Local') && (
                  <TableCell className="w-80">{local.id}</TableCell>
                )}
                <TableCell className="">{local.nome}</TableCell>
                {permissoes.can('manage', 'Local') && (
                  <TableCell className="w-40">
                    {local.ativo ? 'Ativo' : 'Inativo'}
                  </TableCell>
                )}
                <TableCell className="w-40 space-x-2" align="right">
                  <Button size="sm">
                    <Pen />
                    Editar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    variant={local.ativo ? 'destructive' : 'secondary'}
                  >
                    {local.ativo ? <Ban /> : <Power />}
                    {local.ativo ? 'Inativar' : 'Ativar'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Paginacao
            itensPorPagina={itensPorPagina}
            setItensPorPagina={setItensPorPagina}
            total={locaisFiltrados.length}
            paginaAtual={paginaAtual}
            setPaginaAtual={setPaginaAtual}
          />
        </Table>
      </div>
    </div>
  )
}

export { ListaLocais }

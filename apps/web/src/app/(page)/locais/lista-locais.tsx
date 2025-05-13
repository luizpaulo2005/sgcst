'use client'

import { Ban, Loader2, Power, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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
import { useFormState } from '@/hooks/use-form-state'
import { useIsMobile } from '@/hooks/use-mobile'

import { alterarStatusLocalAction } from './actions'
import { EditarLocal } from './editar-local'

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

  const [{ message, success }, handleSubmit, isPending] = useFormState(
    alterarStatusLocalAction,
    () => {
      toast.success('Status do local alterado com sucesso')
    },
  )

  useEffect(() => {
    if (!success && message) {
      toast.error(message)
    }
  }, [isPending])

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
                <TableCell className="">{local.nome}</TableCell>
                {permissoes.can('manage', 'Local') && (
                  <TableCell className="w-40">
                    {local.ativo ? 'Ativo' : 'Inativo'}
                  </TableCell>
                )}
                <TableCell className="w-40 space-x-2" align="right">
                  {permissoes.can('atualizar', 'Local') && (
                    <EditarLocal local={local} />
                  )}
                  {permissoes.can('cancelar', 'Local') && (
                    <form onSubmit={handleSubmit} className="inline">
                      <input type="hidden" name="id" value={local.id} />
                      <Button
                        disabled={isPending}
                        type="submit"
                        size="sm"
                        variant={local.ativo ? 'destructive' : 'secondary'}
                      >
                        {isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            {local.ativo ? <Ban /> : <Power />}
                            {local.ativo ? 'Inativar' : 'Ativar'}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
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

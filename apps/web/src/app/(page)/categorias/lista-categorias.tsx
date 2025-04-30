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

import { alterarStatusCategoriaAction } from './actions'
import { EditarCategoria } from './editar-categoria'

interface ListaCategoriasProps {
  categorias: {
    id: string
    descricao: string
    ativo?: boolean
  }[]
}

const ListaCategorias = ({ categorias }: ListaCategoriasProps) => {
  const permissoes = useAbility()
  const isMobile = useIsMobile()
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [valorBusca, setValorBusca] = useState('')
  const [inputBusca, setInputBusca] = useState('')

  const categoriasFiltradas = categorias.filter((categoria) => {
    const matchesBusca =
      valorBusca === '' ||
      (categoria.descricao &&
        categoria.descricao.toLowerCase().includes(valorBusca.toLowerCase()))

    const matchesStatus =
      statusFiltro === '' ||
      (statusFiltro === 'ativo' && categoria.ativo) ||
      (statusFiltro === 'inativo' && !categoria.ativo) ||
      (statusFiltro === 'todos' && true)

    return matchesBusca && matchesStatus
  })

  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  const indiceUltimoItem = paginaAtual * itensPorPagina
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina
  const categoriasPaginadas = categoriasFiltradas.slice(
    indicePrimeiroItem,
    indiceUltimoItem,
  )

  useEffect(() => {
    setPaginaAtual(1)
  }, [itensPorPagina, statusFiltro, valorBusca])

  const [{ message, success }, handleSubmit, isPending] = useFormState(
    alterarStatusCategoriaAction,
    () => {
      toast.success('Status da categoria alterado com sucesso')
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
          placeholder="Busque pela descrição"
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
              {permissoes.can('manage', 'Categoria') && (
                <TableHead>ID</TableHead>
              )}
              <TableHead>Descrição</TableHead>
              {permissoes.can('manage', 'Categoria') && (
                <TableHead>Status</TableHead>
              )}
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categoriasPaginadas.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            )}
            {categoriasPaginadas.map((categoria) => (
              <TableRow key={categoria.id}>
                {permissoes.can('manage', 'Categoria') && (
                  <TableCell className="w-80">{categoria.id}</TableCell>
                )}
                <TableCell className="">{categoria.descricao}</TableCell>
                {permissoes.can('manage', 'Categoria') && (
                  <TableCell className="w-40">
                    {categoria.ativo ? 'Ativo' : 'Inativo'}
                  </TableCell>
                )}
                <TableCell className="w-40 space-x-2" align="right">
                  {permissoes.can('atualizar', 'Categoria') && (
                    <EditarCategoria categoria={categoria} />
                  )}
                  {permissoes.can('cancelar', 'Categoria') && (
                    <form onSubmit={handleSubmit} className="inline">
                      <input type="hidden" name="id" value={categoria.id} />
                      <Button
                        type="submit"
                        size="sm"
                        variant={categoria.ativo ? 'destructive' : 'secondary'}
                      >
                        {isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            {categoria.ativo ? <Ban /> : <Power />}
                            {categoria.ativo ? 'Inativar' : 'Ativar'}
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
            total={categoriasFiltradas.length}
            paginaAtual={paginaAtual}
            setPaginaAtual={setPaginaAtual}
          />
        </Table>
      </div>
    </div>
  )
}

export { ListaCategorias }

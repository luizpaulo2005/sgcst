'use client'

import {
  Ban,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Power,
  Search,
  Trash,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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
  TableFooter,
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

  const totalPaginas = Math.ceil(categoriasFiltradas.length / itensPorPagina)

  const primeiraPagina = () => setPaginaAtual(1)
  const ultimaPagina = () => setPaginaAtual(totalPaginas)
  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1)
  }
  const paginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1)
  }

  useEffect(() => {
    setPaginaAtual(1)
  }, [itensPorPagina, statusFiltro])

  if (permissoes.cannot('atualizar', 'Categoria')) {
    return (
      <div className="flex h-[calc(100vh-7.1rem)] flex-1 items-center justify-center px-4">
        <h1 className="text-lg font-bold">
          Você não tem permissão para visualizar a seção de categorias.{' '}
          <Link href="/" className="text-muted-foreground hover:underline">
            Voltar
          </Link>
        </h1>
      </div>
    )
  }

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
          <TableFooter className="bg-background">
            <TableRow>
              <TableCell colSpan={4} className="p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    Mostrando
                    <Select
                      value={itensPorPagina.toString()}
                      onValueChange={(value) =>
                        setItensPorPagina(Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={itensPorPagina} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    de {categoriasFiltradas.length} registros
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      Página {paginaAtual} de {totalPaginas}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={primeiraPagina}
                      disabled={paginaAtual === 1}
                    >
                      <ChevronsLeft className="cursor-pointer" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={paginaAnterior}
                      disabled={paginaAtual === 1}
                    >
                      <ChevronLeft className="cursor-pointer" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={proximaPagina}
                      disabled={paginaAtual === totalPaginas}
                    >
                      <ChevronRight className="cursor-pointer" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={ultimaPagina}
                      disabled={paginaAtual === totalPaginas}
                    >
                      <ChevronsRight className="cursor-pointer" />
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}

export { ListaCategorias }

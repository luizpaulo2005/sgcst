'use client'

import { Ban, Loader2, Pen, Power } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { useAbility } from '@/components/providers/permissoes'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFormState } from '@/hooks/use-form-state'

import { alterarStatusCategoriaAction } from './actions'

interface ListaCategoriasProps {
  categorias: {
    id: string
    descricao: string
    ativo?: boolean
  }[]
}

const ListaCategorias = ({ categorias }: ListaCategoriasProps) => {
  const permissoes = useAbility()

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
    <Table>
      <TableHeader>
        <TableRow>
          {permissoes.can('manage', 'Categoria') && <TableHead>ID</TableHead>}
          <TableHead>Descrição</TableHead>
          {permissoes.can('manage', 'Categoria') && (
            <TableHead>Status</TableHead>
          )}
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categorias.map((categoria) => (
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
                <Button size="sm">
                  <Pen />
                  Editar
                </Button>
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
    </Table>
  )
}

export { ListaCategorias }

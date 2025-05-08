'use client'

import { Loader2, Search, Trash, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Paginacao } from '@/components/paginacao'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

import { revogarConviteAction } from './actions'

interface ListaConvitesProps {
  convites: Array<{
    id: string
    email: string
    cargo: 'ADMINISTRADOR' | 'TECNICO'
    criadoEm: Date
  }>
}

const ListaConvites = ({ convites }: ListaConvitesProps) => {
  const isMobile = useIsMobile()
  const [valorBusca, setValorBusca] = useState('')
  const [inputBusca, setInputBusca] = useState('')

  const convitesFiltrados = convites.filter((convite) => {
    const matchesBusca =
      valorBusca === '' ||
      (convite.email &&
        convite.email.toLowerCase().includes(valorBusca.toLowerCase()))

    return matchesBusca
  })

  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  const indiceUltimoItem = paginaAtual * itensPorPagina
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina
  const convitesPaginados = convitesFiltrados.slice(
    indicePrimeiroItem,
    indiceUltimoItem,
  )

  useEffect(() => {
    setPaginaAtual(1)
  }, [itensPorPagina, valorBusca])

  const [{ message, success }, handleSubmit, isPending] = useFormState(
    revogarConviteAction,
    () => {
      toast.success('Convite revogado com sucesso')
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
          onChange={(e) => {
            setInputBusca(e.target.value)
          }}
          className="max-w-80"
          placeholder="Buscar por e-mail"
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
      </div>
      <div className="rounded-md border p-px">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>E-mail</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-end">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {convitesPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            )}
            {convitesPaginados.map((convite) => (
              <TableRow key={convite.id}>
                <TableCell>{convite.email}</TableCell>
                <TableCell>{convite.cargo}</TableCell>
                <TableCell align="right">
                  <form onSubmit={handleSubmit} className="inline">
                    <input type="hidden" name="id" value={convite.id} />
                    <Button disabled={isPending} variant="destructive">
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          <X />
                          Revogar convite
                        </>
                      )}
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Paginacao
            paginaAtual={paginaAtual}
            setPaginaAtual={setPaginaAtual}
            total={convitesFiltrados.length}
            itensPorPagina={itensPorPagina}
            setItensPorPagina={setItensPorPagina}
          />
        </Table>
      </div>
    </div>
  )
}

export { ListaConvites }

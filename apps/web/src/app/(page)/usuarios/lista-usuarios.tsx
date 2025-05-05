'use client'

import { Ban, Loader2, Power, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

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
import { useFormState } from '@/hooks/use-form-state'
import { useIsMobile } from '@/hooks/use-mobile'

import { alterarStatusUsuarioAction } from './actions'

interface ListaUsuariosProps {
  usuarioAtualId: string
  usuarios: Array<{
    id: string
    nome: string | null
    email: string
    avatarUrl: string | null
    ativo: boolean
    cargo: 'ADMINISTRADOR' | 'TECNICO'
  }>
}

const ListaUsuarios = ({ usuarios, usuarioAtualId }: ListaUsuariosProps) => {
  const [statusFiltro, setStatusFiltro] = useState('todos')
  const [cargoFiltro, setCargoFiltro] = useState('todos')
  const [valorBusca, setValorBusca] = useState('')
  const [inputBusca, setInputBusca] = useState('')
  const isMobile = useIsMobile()

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const matchesBusca =
      valorBusca === '' ||
      (usuario.nome &&
        usuario.nome.toLowerCase().includes(valorBusca.toLowerCase())) ||
      (usuario.email &&
        usuario.email.toLowerCase().includes(valorBusca.toLowerCase()))

    const matchesStatus =
      statusFiltro === '' ||
      (statusFiltro === 'ativo' && usuario.ativo) ||
      (statusFiltro === 'inativo' && !usuario.ativo) ||
      (statusFiltro === 'todos' && true)

    const matchesCargo =
      cargoFiltro === '' ||
      (cargoFiltro === 'ADMINISTRADOR' && usuario.cargo === 'ADMINISTRADOR') ||
      (cargoFiltro === 'TECNICO' && usuario.cargo === 'TECNICO') ||
      (cargoFiltro === 'todos' && true)

    return matchesBusca && matchesStatus && matchesCargo
  })

  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)

  const indiceUltimoItem = paginaAtual * itensPorPagina
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina
  const usuariosPaginados = usuariosFiltrados.slice(
    indicePrimeiroItem,
    indiceUltimoItem,
  )

  useEffect(() => {
    setPaginaAtual(1)
  }, [itensPorPagina, statusFiltro, cargoFiltro, valorBusca])

  const [{ message, success }, handleSubmit, isPending] = useFormState(
    alterarStatusUsuarioAction,
    () => {
      setValorBusca('')
      setInputBusca('')
      setStatusFiltro('todos')
      setCargoFiltro('todos')
      setPaginaAtual(1)
      toast.success('Status do usuário alterado com sucesso!')
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
          placeholder="Busque pelo nome ou e-mail"
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
        <span>Cargo: </span>
        <Select value={cargoFiltro} onValueChange={setCargoFiltro}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
            <SelectItem value="TECNICO">Técnico</SelectItem>
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border p-px">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Informações</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuariosPaginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Nenhum registro encontrado
                </TableCell>
              </TableRow>
            )}
            {usuariosPaginados.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="w-80">{usuario.id}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="size-6">
                    {usuario.avatarUrl && (
                      <AvatarImage src={usuario.avatarUrl} />
                    )}
                    <AvatarFallback>
                      {obterIniciais(usuario.nome ?? usuario.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col gap-px">
                    <p className="font-semibold">
                      {usuario.nome ? usuario.nome : 'Nome não informado'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {usuario.email}
                    </p>
                  </span>
                </TableCell>
                <TableCell>
                  {usuario.cargo === 'ADMINISTRADOR' && 'Administrador'}
                  {usuario.cargo === 'TECNICO' && 'Técnico'}
                </TableCell>
                <TableCell className="w-40">
                  {usuario.ativo ? 'Ativo' : 'Inativo'}
                </TableCell>
                <TableCell className="w-40 space-x-2" align="right">
                  <form onSubmit={handleSubmit} className="inline">
                    <input type="hidden" name="id" value={usuario.id} />
                    <Button
                      disabled={isPending || usuario.id === usuarioAtualId}
                      type="submit"
                      size="sm"
                      variant={usuario.ativo ? 'destructive' : 'secondary'}
                    >
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <>
                          {usuario.ativo ? <Ban /> : <Power />}
                          {usuario.ativo ? 'Inativar' : 'Ativar'}
                        </>
                      )}
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Paginacao
            itensPorPagina={itensPorPagina}
            setItensPorPagina={setItensPorPagina}
            total={usuariosFiltrados.length}
            paginaAtual={paginaAtual}
            setPaginaAtual={setPaginaAtual}
          />
        </Table>
      </div>
    </div>
  )
}

export { ListaUsuarios }

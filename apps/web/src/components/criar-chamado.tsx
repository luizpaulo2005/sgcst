'use client'

import { AlertTriangle, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { criarChamadoAction } from '@/app/(page)/actions'
import { useFormState } from '@/hooks/use-form-state'
import { useIsMobile } from '@/hooks/use-mobile'

import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Textarea } from './ui/textarea'

interface CriarChamadoProps {
  categorias: Array<{ id: string; descricao: string; ativo?: boolean }>
  locais: Array<{
    id: string
    nome: string
    avatarUrl?: string | null
    ativo?: boolean
  }>
}

const CriarChamado = ({ categorias, locais }: CriarChamadoProps) => {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    criarChamadoAction,
    () => {
      toast.success('Chamado criado com sucesso!')
      setIsOpen(false)
    },
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={isMobile ? 'icon' : 'default'} variant="outline">
          <Plus />
          {!isMobile && 'Abrir chamado'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir chamado</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro ao criar chamado!</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              type="text"
              name="titulo"
              id="titulo"
              placeholder="Título do chamado"
            />
            {errors?.titulo && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.titulo[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              name="descricao"
              id="descricao"
              placeholder="Descrição do chamado"
            />
            {errors?.descricao && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.descricao[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select name="prioridade">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAIXA">Baixa</SelectItem>
                <SelectItem value="MEDIA">Média</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="URGENTE">Urgente</SelectItem>
              </SelectContent>
            </Select>
            {errors?.prioridade && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.prioridade[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="localId">Local</Label>
            <Select name="localId" disabled={locais.length === 0}>
              <SelectTrigger className="w-full overflow-hidden">
                <SelectValue
                  placeholder="Selecione um local"
                  className="w-full truncate text-ellipsis whitespace-nowrap"
                />
              </SelectTrigger>
              <SelectContent>
                {locais.map((local) => (
                  <SelectItem
                    key={local.id}
                    value={local.id}
                    className="capitalize"
                  >
                    {local.avatarUrl && (
                      <img
                        src={local.avatarUrl}
                        alt={local.nome}
                        className="size-4 rounded-full"
                      />
                    )}
                    {local.nome} {!local.ativo && '(inativo)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.localId && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.localId[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoriaId">Categoria</Label>
            <Select name="categoriaId" disabled={categorias.length === 0}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((categoria) => (
                  <SelectItem
                    key={categoria.id}
                    value={categoria.id}
                    className="capitalize"
                  >
                    {categoria.descricao} {!categoria.ativo && '(inativo)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.categoriaId && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.categoriaId[0]}
              </p>
            )}
          </div>
          <Button
            disabled={isPending}
            type="submit"
            variant="default"
            className="w-full"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Criar chamado'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CriarChamado }

'use client'

import { AlertTriangle, Loader2, Pen } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { editarLocalAction } from './actions'

interface EditarLocalProps {
  local: {
    id: string
    nome: string
    avatarUrl?: string | null
  }
}

const EditarLocal = ({ local }: EditarLocalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    editarLocalAction,
    () => {
      toast.success('Local atualizado com sucesso!')
      setIsOpen(false)
    },
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Pen />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Local</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" id="id" name="id" value={local.id} />
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro ao adicionar categoria!</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              defaultValue={local.nome}
              placeholder="Nome do local"
            />
            {errors?.nome && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.nome[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Logo do Local</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              defaultValue={local.avatarUrl ?? ''}
              placeholder="URL da logo do Local"
            />
            {errors?.avatarUrl && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.avatarUrl[0]}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Atualizar'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { EditarLocal }

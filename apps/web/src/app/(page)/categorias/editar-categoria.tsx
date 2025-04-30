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

import { editarCategoriaAction } from './actions'

interface EditarCategoriaProps {
  categoria: {
    id: string
    descricao: string
  }
}

const EditarCategoria = ({ categoria }: EditarCategoriaProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    editarCategoriaAction,
    () => {
      toast.success('Categoria editada com sucesso')
      setIsOpen(false)
    },
  )

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Pen />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" id="id" name="id" value={categoria.id} />
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
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              defaultValue={categoria.descricao}
              placeholder="Descrição da categoria"
            />
            {errors?.descricao && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.descricao[0]}
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

export { EditarCategoria }

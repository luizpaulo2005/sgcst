'use client'

import { AlertTriangle, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { useAbility } from '@/components/providers/permissoes'
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

import { criarCategoriaAction } from './actions'

const CriarCategoria = () => {
  const [isOpen, setIsOpen] = useState(false)
  const permissoes = useAbility()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    criarCategoriaAction,
    () => {
      toast.success('Categoria criada com sucesso!')
      setIsOpen(false)
    },
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {permissoes.can('criar', 'Categoria') && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Nova Categoria
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="descricao">Descrição da Categoria</Label>
            <Input type="text" name="descricao" id="descricao" />
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
              'Criar Categoria'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export { CriarCategoria }

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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { criarLocalAction } from './actions'

const CriarLocal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const permissoes = useAbility()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    criarLocalAction,
    () => {
      toast.success('Local criado com sucesso!')
      setIsOpen(false)
    },
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {permissoes.can('criar', 'Local') && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Novo Local
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>Adicionar Local</DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro ao adicionar local!</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Local</Label>
            <Input
              id="nome"
              name="nome"
              type="text"
              placeholder="Nome do Local"
            />
            {errors?.nome && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.nome[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Nome do Local</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="text"
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
              'Criar Local'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CriarLocal }

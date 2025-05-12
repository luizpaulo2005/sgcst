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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFormState } from '@/hooks/use-form-state'

import { criarConviteAction } from './actions'

const CriarConvite = () => {
  const [isOpen, setIsOpen] = useState(false)
  const permissoes = useAbility()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    criarConviteAction,
    () => {
      toast.success('Convite criado com sucesso!')
      setIsOpen(false)
    },
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {permissoes.can('criar', 'Convite') && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            Criar convite
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Convite</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success === false && message && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Erro ao criar convite!</AlertTitle>
              <AlertDescription>
                <p>{message}</p>
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input type="email" name="email" id="email" />
            {errors?.email && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.email[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Cargo</Label>
            <Select name="cargo">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                <SelectItem value="TECNICO">Técnico</SelectItem>
              </SelectContent>
            </Select>
            {errors?.cargo && (
              <p className="text-xs font-medium text-red-500 dark:text-red-400">
                {errors.cargo[0]}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Criar Convite'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { CriarConvite }

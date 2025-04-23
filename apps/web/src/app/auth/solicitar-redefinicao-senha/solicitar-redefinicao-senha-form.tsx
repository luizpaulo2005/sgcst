'use client'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { solicitarRedefinicaoSenhaAction } from '@/components/header/perfil/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

const SolicitarRedefinicaoSenhaForm = () => {
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    solicitarRedefinicaoSenhaAction,
    () => {
      toast.success('E-mail enviado com sucesso!')
    },
  )

  return (
    <Card className="bg-card text-card-foreground w-full max-w-xl p-6 shadow">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro ao solicitar redefinicao de senha!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-semibold">Solicitar redefinicao de senha</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" className="flex-1" asChild>
            <Link href="/auth/login">Voltar ao login</Link>
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            className="flex-1"
            variant="default"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Solicitar redefinição'
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export { SolicitarRedefinicaoSenhaForm }

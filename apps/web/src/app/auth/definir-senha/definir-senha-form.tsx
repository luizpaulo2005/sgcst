'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/use-form-state'

import { definirSenhaAction } from './actions'

const DefinirSenhaForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  if (!token) {
    router.push('/auth/login')
  }

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    definirSenhaAction,
    () => {
      router.push('/auth/login')
    },
  )

  return (
    <Card className="bg-card text-card-foreground w-full max-w-xl p-6 shadow">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro ao definir a senha!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-semibold">Defina sua senha</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="hidden"
          name="codigo"
          id="codigo"
          value={token || ''}
          readOnly
        />
        <div className="space-y-2">
          <Label>Senha</Label>
          <Input
            name="senha"
            type="password"
            id="senha"
            placeholder="Digite sua senha"
          />

          {errors?.senha && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.senha[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Confirmar senha</Label>
          <Input
            name="confirmarSenha"
            type="password"
            id="confirmarSenha"
            placeholder="Confirme sua senha"
          />

          {errors?.confirmarSenha && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.confirmarSenha[0]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            disabled={isPending}
            type="button"
            className="flex-1"
            variant="secondary"
            asChild
          >
            <Link href="/auth/login">Voltar para login</Link>
          </Button>
          <Button disabled={isPending} className="flex-1" variant="outline">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Definir senha'
            )}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export { DefinirSenhaForm }

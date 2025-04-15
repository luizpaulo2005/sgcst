'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { autenticarComGoogle } from '../actions'
import { registrar } from './actions'

const RegistrarForm = () => {
  const router = useRouter()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    registrar,
    () => {
      router.push('/auth/login')
    },
  )

  return (
    <Card className="bg-card text-card-foreground w-full max-w-xl p-6 shadow">
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro ao realizar registro!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-semibold">Registre-se</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Nome</Label>
          <Input name="nome" id="nome" placeholder="Digite seu nome" />

          {errors?.nome && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.nome[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
          />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
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
            <Link href="/auth/login">Fazer login</Link>
          </Button>
          <Button disabled={isPending} className="flex-1" variant="outline">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              'Registrar'
            )}
          </Button>
        </div>
        <Separator />
      </form>
      <form action={autenticarComGoogle}>
        <Button
          disabled={isPending}
          type="submit"
          variant="secondary"
          className="w-full"
        >
          <img
            src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
            className="size-6"
            alt=""
          />
          Fazer login com o Google
        </Button>
      </form>
    </Card>
  )
}

export { RegistrarForm }

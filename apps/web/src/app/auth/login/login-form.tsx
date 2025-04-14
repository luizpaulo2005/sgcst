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
import { autenticarComEmailESenha } from './actions'

const LoginForm = () => {
  const router = useRouter()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    autenticarComEmailESenha,
    () => {
      router.push('/')
    },
  )

  if (errors) {
    console.error(errors)
  }

  return (
    <Card className="bg-card text-card-foreground w-xl p-6 shadow">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Erro ao realizar login!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-semibold">Acesso ao painel</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Link className="hover:underline" href="#">
            Esqueceu a senha?
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" className="flex-1" variant="secondary" asChild>
            <Link href="/auth/registrar">Registrar</Link>
          </Button>
          <Button className="flex-1" variant="outline">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
          </Button>
        </div>
        <Separator />
      </form>
      <form action={autenticarComGoogle}>
        <Button type="submit" variant="secondary" className="w-full">
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

export { LoginForm }

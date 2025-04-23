'use client'

import { Ban, CircleAlert, Loader2, Pen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useFormState } from '@/hooks/use-form-state'

import { Button } from '../../ui/button'
import { DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Separator } from '../../ui/separator'
import {
  atualizarUsuarioAction,
  solicitarRedefinicaoSenhaAction,
  solicitarVerificacaoEmailAction,
} from './actions'

interface DetalhesPerfilProps {
  usuario: {
    id: string
    nome: string | null
    email: string
    avatarUrl: string | null
    emailVerificado: boolean
  }
}

const DetalhesPerfil = ({ usuario }: DetalhesPerfilProps) => {
  const [edicaoAtiva, setEdicaoAtiva] = useState(false)
  const [informacoes, setInformacoes] = useState({
    nome: usuario.nome ?? '',
    email: usuario.email,
    avatarUrl: usuario.avatarUrl ?? '',
    emailVerificado: usuario.emailVerificado,
  })

  const [{ errors, message, success }, handleUsuarioSubmit, isUsuarioPending] =
    useFormState(atualizarUsuarioAction, () => {
      setEdicaoAtiva(false)
      toast.success('Informações atualizadas com sucesso!')
    })

  const [
    { success: emailSuccess, message: emailMessage },
    handleEmailSubmit,
    isEmailPending,
  ] = useFormState(solicitarVerificacaoEmailAction, () => {
    toast.success('E-mail enviado com sucesso!')
  })

  const [
    { success: senhaSuccess, message: senhaMessage },
    handleSenhaSubmit,
    isSenhaPending,
  ] = useFormState(solicitarRedefinicaoSenhaAction, () => {
    toast.success('E-mail enviado com sucesso!')
  })

  useEffect(() => {
    if (!emailSuccess && emailMessage) {
      toast.error(emailMessage ?? 'Erro inesperado.')
    }
  }, [isEmailPending])

  useEffect(() => {
    if (!senhaSuccess && senhaMessage) {
      toast.error(senhaMessage ?? 'Erro inesperado.')
    }
  }, [isSenhaPending])

  useEffect(() => {
    if (!success && message) {
      toast.error(message ?? 'Erro inesperado.')
    }
  }, [isUsuarioPending])

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do Perfil</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleUsuarioSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            name="nome"
            value={informacoes.nome}
            onChange={(e) => {
              setInformacoes((prev) => {
                return { ...prev, nome: e.target.value }
              })
            }}
            disabled={!edicaoAtiva}
          />
          {errors?.nome && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.nome[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" value={informacoes.email} disabled />
          {!informacoes.emailVerificado && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <CircleAlert className="size-4" />
              <span>E-mail não verificado.</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Foto de perfil (url)</Label>
          <Input
            id="avatarUrl"
            name="avatarUrl"
            value={informacoes.avatarUrl}
            onChange={(e) => {
              setInformacoes((prev) => {
                return { ...prev, avatarUrl: e.target.value }
              })
            }}
            disabled={!edicaoAtiva}
          />
          {errors?.avatarUrl && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.avatarUrl[0]}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={edicaoAtiva ? 'destructive' : 'secondary'}
            type="button"
            onClick={() => setEdicaoAtiva((prev) => !prev)}
            className="flex-1"
          >
            {edicaoAtiva ? (
              <>
                <Ban />
                Cancelar edição
              </>
            ) : (
              <>
                <Pen />
                Editar
              </>
            )}
          </Button>
          {edicaoAtiva && (
            <Button type="submit" className="flex-1">
              {isUsuarioPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Salvar'
              )}
            </Button>
          )}
        </div>
      </form>
      <Separator />
      <div className="flex items-center gap-2">
        <form onSubmit={handleSenhaSubmit} className="flex-1">
          <input
            id="email"
            name="email"
            type="hidden"
            value={informacoes.email}
          />
          <Button className="w-full">Trocar senha</Button>
        </form>
        {!informacoes.emailVerificado && (
          <form onSubmit={handleEmailSubmit} className="flex-1">
            <Button className="w-full">
              {isEmailPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Verificar e-mail'
              )}
            </Button>
          </form>
        )}
      </div>
    </DialogContent>
  )
}

export { DetalhesPerfil }

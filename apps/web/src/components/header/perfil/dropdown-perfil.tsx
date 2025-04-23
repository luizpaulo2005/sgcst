'use client'
import { LogOut, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DetalhesPerfil } from './detalhes-perfil'

interface DropdownPerfilProps {
  usuario: {
    id: string
    nome: string | null
    email: string
    avatarUrl: string | null
    emailVerificado: boolean
  }
}

const obterIniciais = (nome: string): string => {
  const iniciais = nome
    .split(' ')
    .map((texto) => texto.charAt(0).toUpperCase())
    .join('')

  return iniciais
}

const DropdownPerfil = ({ usuario }: DropdownPerfilProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (isDialogOpen) {
      setDropdownOpen(false)
    }
  }, [isDialogOpen])

  return (
    <>
      <Dialog onOpenChange={setDialogOpen} open={isDialogOpen}>
        <DropdownMenu onOpenChange={setDropdownOpen} open={isDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <p className="max-w-24 truncate">
                {usuario.nome ?? usuario.email}
              </p>
              <Avatar className="size-5">
                {usuario.avatarUrl && <AvatarImage src={usuario.avatarUrl} />}
                <AvatarFallback>
                  {obterIniciais(usuario.nome ?? usuario.email)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <User />
                Perfil
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem asChild>
              <a href="/api/auth/logout">
                <LogOut />
                Sair
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DetalhesPerfil usuario={usuario} />
      </Dialog>
    </>
  )
}

export { DropdownPerfil }

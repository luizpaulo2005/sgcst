import { LogOut } from 'lucide-react'

import { auth } from '@/auth/auth'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const obterIniciais = (nome: string): string => {
  const iniciais = nome
    .split(' ')
    .map((texto) => texto.charAt(0).toUpperCase())
    .join('')

  return iniciais
}

const Perfil = async () => {
  const { usuario } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <p>{usuario.nome}</p>
          <Avatar className="size-5">
            {usuario.avatarUrl && <AvatarImage src={usuario.avatarUrl} />}
            <AvatarFallback>
              {obterIniciais(usuario.nome ?? usuario.email)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a href="/api/auth/logout">
            <LogOut />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { Perfil }

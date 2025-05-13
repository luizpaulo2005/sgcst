import { CriarChamado } from '../criar-chamado'
import { ToggleTheme } from '../toggle-theme'
import { Button } from '../ui/button'
import { SidebarTrigger } from '../ui/sidebar'
import { Perfil } from './perfil/perfil'

interface HeaderProps {
  categorias: Array<{ id: string; descricao: string; ativo?: boolean }>
  locais: Array<{
    id: string
    nome: string
    avatarUrl?: string | null
    ativo?: boolean
  }>
}

const Header = ({ categorias, locais }: HeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Button variant="outline" size="icon" asChild>
        <SidebarTrigger />
      </Button>
      <div className="flex items-center gap-2">
        <CriarChamado categorias={categorias} locais={locais} />
        <ToggleTheme />
        <Perfil />
      </div>
    </div>
  )
}

export { Header }

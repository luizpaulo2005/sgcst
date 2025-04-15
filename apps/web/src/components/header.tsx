import { Perfil } from './perfil'
import { ToggleTheme } from './toggle-theme'
import { Button } from './ui/button'
import { SidebarTrigger } from './ui/sidebar'

const Header = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <Button variant="outline" size="icon" asChild>
        <SidebarTrigger />
      </Button>
      <div className="flex items-center gap-2">
        <ToggleTheme />
        <Perfil />
      </div>
    </div>
  )
}

export { Header }

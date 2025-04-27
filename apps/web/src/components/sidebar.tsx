import {
  AppWindow,
  ChartLine,
  Home,
  Logs,
  Mail,
  MapPin,
  MessageSquare,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAbility } from './providers/permissoes'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar'

const AppSidebar = () => {
  const path = usePathname()
  const permissoes = useAbility()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Chamados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {permissoes && permissoes.can('manage', 'Chamado') && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={path === '/'} asChild>
                    <Link href="/">
                      <Home />
                      Painel
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={path === '/meus-chamados'} asChild>
                  <Link href="/meus-chamados">
                    <MessageSquare />
                    Meus chamados
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {permissoes && permissoes.can('manage', 'Chamado') && (
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={path === '/chamados'} asChild>
                    <Link href="/chamados">
                      <AppWindow />
                      Chamados
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {permissoes && permissoes.can('manage', 'Usuario') && (
          <SidebarGroup>
            <SidebarGroupLabel>Usuários</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={path === '/usuarios'} asChild>
                      <Link href="/usuarios">
                        <Users />
                        Usuários
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={path === '/convites'} asChild>
                      <Link href="/convites">
                        <Mail />
                        Convites
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {permissoes &&
          (permissoes.can('atualizar', 'Local') ||
            permissoes.can('atualizar', 'Categoria')) && (
            <SidebarGroup>
              <SidebarGroupLabel>Configurações</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={path === '/categorias'}
                      asChild
                    >
                      <Link href="/categorias">
                        <Logs />
                        Categorias
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={path === '/locais'} asChild>
                      <Link href="/locais">
                        <MapPin />
                        Locais
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        {permissoes && permissoes.can('manage', 'Chamado') && (
          <SidebarGroup>
            <SidebarGroupLabel>Dados</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={path === '/graficos'} asChild>
                    <Link href="/graficos">
                      <ChartLine />
                      Gráficos
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

export { AppSidebar }

'use client'

import {
  SidebarInset,
  SidebarProvider as SidebarUIProvider,
} from '@/components/ui/sidebar'

import { AppSidebar } from '../sidebar'

interface SidebarProviderProps {
  children: React.ReactNode
}

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  return (
    <SidebarUIProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarUIProvider>
  )
}

export { SidebarProvider }

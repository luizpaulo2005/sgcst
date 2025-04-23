import './globals.css'

import type { Metadata } from 'next'
import { Space_Grotesk as spaceGroteskFont } from 'next/font/google'

import { ThemeProvider } from '@/components/providers/theme'
import { Toaster } from '@/components/ui/sonner'

const spaceGrotesk = spaceGroteskFont({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SGCST',
  description: 'Sistema de Gerenciamento de Chamados para Suporte Técnico',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <body
          className={`antialised bg-sidebar text-foreground ${spaceGrotesk.variable}`}
        >
          <Toaster richColors />
          {children}
        </body>
      </ThemeProvider>
    </html>
  )
}

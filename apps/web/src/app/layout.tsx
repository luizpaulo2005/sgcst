import './globals.css'

import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/providers/theme'

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
      <body className="antialised">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

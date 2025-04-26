import { HTTPError } from 'ky'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

import { obterChamado } from '@/http/obter-chamado'

import { DetalhesChamado } from './detalhes-chamado'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  try {
    const { chamado } = await obterChamado({ id })

    if (!chamado) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="size-4 animate-spin" />
        </div>
      )
    }

    return <DetalhesChamado chamado={chamado} />
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status === 401) {
        return (
          <div className="flex flex-1 items-center justify-center">
            <h1 className="text-xl font-bold">
              Você não tem permissão para visualizar este chamado.{' '}
              <Link
                href="/meus-chamados"
                className="text-muted-foreground hover:underline"
              >
                Voltar
              </Link>
            </h1>
          </div>
        )
      }
    }

    return (
      <div className="flex flex-1 items-center justify-center">
        <h1 className="text-xl font-bold">
          Ocorreu um erro ao carregar o chamado.{' '}
          <Link
            href="/meus-chamados"
            className="text-muted-foreground hover:underline"
          >
            Voltar
          </Link>
        </h1>
      </div>
    )
  }
}

export default Page

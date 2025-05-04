'use client'

import { useRouter } from 'next/navigation'

const CardSemPermissaoPagina = () => {
  const router = useRouter()

  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-xl font-semibold">
        Você não tem permissão para acessar essa página.{' '}
        <span
          onClick={() => router.back()}
          className="text-muted-foreground cursor-pointer hover:underline"
        >
          Voltar
        </span>
      </h1>
    </div>
  )
}

export { CardSemPermissaoPagina }

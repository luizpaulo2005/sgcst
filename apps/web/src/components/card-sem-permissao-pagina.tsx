import Link from 'next/link'

const CardSemPermissaoPagina = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-xl font-semibold">
        Você não tem permissão para acessar essa página.{' '}
        <Link href="/" className="text-muted-foreground">
          Voltar
        </Link>
      </h1>
    </div>
  )
}

export { CardSemPermissaoPagina }

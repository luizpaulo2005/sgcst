import { ability } from '@/auth/auth'
import { CardSemPermissaoPagina } from '@/components/card-sem-permissao-pagina'

const Page = async () => {
  const permissoes = await ability()

  if (permissoes.cannot('chamados', 'Acesso')) {
    return <CardSemPermissaoPagina />
  }

  return <div>Page</div>
}

export default Page

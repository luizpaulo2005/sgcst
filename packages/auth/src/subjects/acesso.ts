import { z } from 'zod'

const acessoSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('painel'),
    z.literal('meus-chamados'),
    z.literal('chamados'),
    z.literal('chamado-detalhes'),
    z.literal('usuarios'),
    z.literal('convites'),
    z.literal('categorias'),
    z.literal('locais'),
    z.literal('graficos'),
  ]),
  z.literal('Acesso'),
])

type AcessoSubject = z.infer<typeof acessoSubject>

export { acessoSubject, type AcessoSubject }

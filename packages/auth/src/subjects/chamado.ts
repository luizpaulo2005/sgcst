import { z } from 'zod'

import { chamadoSchema } from '../models/chamado'

const chamadoSubject = z.tuple([
  z.union([
    z.literal('gerenciar'),
    z.literal('abrir'),
    z.literal('visualizar'),
    z.literal('atualizar'),
    z.literal('cancelar'),
  ]),
  z.union([z.literal('Chamado'), chamadoSchema]),
])

type ChamadoSubject = z.infer<typeof chamadoSubject>

export { chamadoSubject, type ChamadoSubject }

'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { criarChamado } from '@/http/criar-chamado'

const criarChamadoSchema = z.object({
  titulo: z.string(),
  descricao: z.string(),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'], {
    message: 'Escolha uma prioridade',
  }),
  categoriaId: z
    .string()
    .optional()
    .transform((val) => (val === '' ? null : val)),
  localId: z.string().nonempty({ message: 'Escolha um local' }),
})

const criarChamadoAction = async (data: FormData) => {
  const result = criarChamadoSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: 'Erro de validação dos dados',
      errors,
    }
  }

  console.log('Dados validados', result.data)

  try {
    await criarChamado(result.data)

    revalidateTag('chamados')

    return {
      success: true,
      message: null,
      errors: null,
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message: 'Erro ao criar chamado',
      errors: null,
    }
  }
}

export { criarChamadoAction }

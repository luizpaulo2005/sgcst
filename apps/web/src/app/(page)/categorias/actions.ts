'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { alterarStatusCategoria } from '@/http/alterar-status-categoria'

const alterarStatusCategoriaSchema = z.object({
  id: z.string(),
})

const alterarStatusCategoriaAction = async (data: FormData) => {
  const result = alterarStatusCategoriaSchema.safeParse(
    Object.fromEntries(data),
  )

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: 'Erro de validação dos dados',
      errors,
    }
  }

  const { id } = result.data

  try {
    await alterarStatusCategoria({ id })

    revalidateTag('categorias')

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
      message: 'Erro ao alterar status da categoria',
      errors: null,
    }
  }
}

export { alterarStatusCategoriaAction }

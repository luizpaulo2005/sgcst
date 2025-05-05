'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { alterarStatusUsuario } from '@/http/alterar-status-usuario'

const alterarStatusUsuarioSchema = z.object({
  id: z.string(),
})

const alterarStatusUsuarioAction = async (data: FormData) => {
  const result = alterarStatusUsuarioSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { id } = result.data

  try {
    await alterarStatusUsuario({ id })

    revalidateTag('usuarios')

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
      message: 'Erro ao alterar status do usuário',
      errors: null,
    }
  }
}

export { alterarStatusUsuarioAction }

'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { criarConvite } from '@/http/criar-convite'

const criarConviteSchema = z.object({
  email: z.string().email('Email inválido'),
  cargo: z.enum(['ADMINISTRADOR', 'TECNICO']),
})

const criarConviteAction = async (data: FormData) => {
  const result = criarConviteSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, cargo } = result.data

  try {
    await criarConvite({ email, cargo })

    revalidateTag('convites')

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
      message: 'Erro ao criar convite',
      errors: null,
    }
  }
}

export { criarConviteAction }

'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { criarLocal } from '@/http/criar-local'

const criarLocalSchema = z.object({
  nome: z.string().nonempty({ message: 'Nome do local é obrigatório' }),
  avatarUrl: z
    .string()
    .transform((value) => (value === '' ? null : value))
    .refine(
      (value) => value === null || z.string().url().safeParse(value).success,
      {
        message: 'URL inválida',
      },
    ),
})

const criarLocalAction = async (formData: FormData) => {
  const result = criarLocalSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { nome, avatarUrl } = result.data

  try {
    await criarLocal({ nome, avatarUrl })

    revalidateTag('locais')

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
      message: 'Erro ao criar categoria',
      errors: null,
    }
  }
}

export { criarLocalAction }

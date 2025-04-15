'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { definirSenha } from '@/http/definir-senha'

const definirSenhaSchema = z
  .object({
    codigo: z.string().nonempty({ message: 'Campo obrigatório.' }),
    senha: z
      .string({ message: 'Campo obrigatório.' })
      .nonempty({ message: 'Campo obrigatório.' })
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' }),
    confirmarSenha: z.string({ message: 'Campo obrigatório.' }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'A senha deve ser igual a confirmação',
    path: ['confirmarSenha'],
  })

const definirSenhaAction = async (data: FormData) => {
  const result = definirSenhaSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { codigo, senha } = result.data

  try {
    await definirSenha({ codigo, senha })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns instantes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}

export { definirSenhaAction }

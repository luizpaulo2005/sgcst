'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { autenticarComSenha } from '@/http/autenticar-com-senha'

const loginSchema = z.object({
  email: z
    .string({ message: 'Campo obrigatório.' })
    .email({ message: 'Informe um e-mail válido.' }),
  senha: z
    .string({ message: 'Campo obrigatório.' })
    .nonempty({ message: 'Campo obrigatório.' }),
})

const autenticarComEmailESenha = async (data: FormData) => {
  const result = loginSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, senha } = result.data

  try {
    const { token } = await autenticarComSenha({ email, senha })

    const cookie = await cookies()

    cookie.set('token', token, { maxAge: 60 * 60 * 24 * 7, path: '/' })
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

export { autenticarComEmailESenha }

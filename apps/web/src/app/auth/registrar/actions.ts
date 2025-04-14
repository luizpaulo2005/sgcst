'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { criarUsuario } from '@/http/criar-usuario'

const registrarSchema = z
  .object({
    nome: z.string().nonempty({ message: 'Campo obrigatório' }),
    email: z.string().email({ message: 'Informe um e-mail válido.' }),
    senha: z.string().nonempty({ message: 'Campo obrigatório' }),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'A senha deve ser igual a confirmação',
    path: ['confirmarSenha'],
  })

const registrar = async (data: FormData) => {
  const result = registrarSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { nome, email, senha } = result.data

  try {
    await criarUsuario({ nome, email, senha })
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

export { registrar }

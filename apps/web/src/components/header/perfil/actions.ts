'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { atualizarUsuario } from '@/http/atualizar-usuario'
import { solicitarRedefinicaoSenha } from '@/http/solicitar-redefinicao-senha'
import { solicitarVerificacaoEmail } from '@/http/solicitar-verificacao-email'

const solicitarVerificacaoEmailAction = async () => {
  try {
    await solicitarVerificacaoEmail()

    return {
      success: true,
      message: 'E-mail enviado com sucesso!',
      errors: null,
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    console.error(error)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns instantes.',
      errors: null,
    }
  }
}

const atualizarUsuarioSchema = z.object({
  nome: z.string().nonempty({ message: 'Campo obrigatório.' }),
  avatarUrl: z
    .string()
    .optional()
    .or(z.string().url({ message: 'A imagem precisa ser uma url válida.' }))
    .transform((value) => (value === '' ? null : value)),
})

const atualizarUsuarioAction = async (data: FormData) => {
  const result = atualizarUsuarioSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { nome, avatarUrl } = result.data

  try {
    await atualizarUsuario({ nome, avatarUrl })

    revalidateTag('usuario')
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    console.error(error)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns instantes.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Usuário atualizado com sucesso!',
    errors: null,
  }
}

const solicitarRedefinicaoSenhaSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
})

const solicitarRedefinicaoSenhaAction = async (data: FormData) => {
  const result = solicitarRedefinicaoSenhaSchema.safeParse(
    Object.fromEntries(data),
  )

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email } = result.data

  try {
    await solicitarRedefinicaoSenha({ email })

    return {
      success: true,
      message: 'E-mail enviado com sucesso!',
      errors: null,
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    console.error(error)

    return {
      success: false,
      message: 'Erro inesperado, tente novamente em alguns instantes.',
      errors: null,
    }
  }
}

export {
  atualizarUsuarioAction,
  solicitarRedefinicaoSenhaAction,
  solicitarVerificacaoEmailAction,
}

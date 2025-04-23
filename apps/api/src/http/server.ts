import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from '@sgcst/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { autenticarComGoogle } from './routes/auth/autenticar-com-google'
import { autenticarComSenha } from './routes/auth/autenticar-com-senha'
import { redefinirSenha } from './routes/auth/redefinir-senha'
import { solicitarRedefinicaoSenha } from './routes/auth/solicitar-redefinicao-senha'
import { solicitarVerificacaoEmail } from './routes/auth/solicitar-verificacao-email'
import { verificarEmail } from './routes/auth/verificar-email'
import { atualizarStatusCategoria } from './routes/categorias/atualizar-status-categoria'
import { criarCategoria } from './routes/categorias/criar-categoria'
import { editarCategoria } from './routes/categorias/editar-categoria'
import { obterCategorias } from './routes/categorias/obter-categorias'
import { abrirChamado } from './routes/chamados/abrir-chamado'
import { adicionarComentario } from './routes/chamados/adicionar-comentario'
import { assumirChamado } from './routes/chamados/assumir-chamado'
import { cancelarChamado } from './routes/chamados/cancelar-chamado'
import { editarChamado } from './routes/chamados/editar-chamado'
import { editarComentario } from './routes/chamados/editar-comentario'
import { obterChamado } from './routes/chamados/obter-chamado'
import { obterChamados } from './routes/chamados/obter-chamados'
import { aceitarConvite } from './routes/convites/aceitar-convite'
import { criarConvite } from './routes/convites/criar-convite'
import { obterConvites } from './routes/convites/obter-convites'
import { revogarConvite } from './routes/convites/revogar-convite'
import { atualizarStatusLocal } from './routes/locais/atualizar-status-local'
import { criarLocal } from './routes/locais/criar-local'
import { editarLocal } from './routes/locais/editar-local'
import { obterLocais } from './routes/locais/obter-locais'
import { atualizarStatusUsuario } from './routes/usuarios/atualizar-status-usuario'
import { atualizarUsuario } from './routes/usuarios/atualizar-usuario'
import { criarUsuario } from './routes/usuarios/criar-usuario'
import { obterPerfil } from './routes/usuarios/obter-perfil'
import { obterUsuarios } from './routes/usuarios/obter-usuarios'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SGCST',
      description: 'Sistema de Gerenciamento de Chamados para Suporte Técnico',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(autenticarComGoogle)
app.register(autenticarComSenha)
app.register(obterPerfil)
app.register(solicitarRedefinicaoSenha)
app.register(redefinirSenha)
app.register(criarUsuario)
app.register(solicitarVerificacaoEmail)
app.register(verificarEmail)

app.register(criarConvite)
app.register(aceitarConvite)
app.register(revogarConvite)
app.register(obterConvites)

app.register(obterLocais)
app.register(criarLocal)
app.register(editarLocal)
app.register(atualizarStatusLocal)

app.register(obterCategorias)
app.register(criarCategoria)
app.register(editarCategoria)
app.register(atualizarStatusCategoria)

app.register(obterChamados)
app.register(obterChamado)
app.register(abrirChamado)
app.register(assumirChamado)
app.register(editarChamado)
app.register(cancelarChamado)
app.register(adicionarComentario)
app.register(editarComentario)

app.register(obterUsuarios)
app.register(atualizarStatusUsuario)
app.register(atualizarUsuario)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`Server is running on port ${env.SERVER_PORT}`)
})

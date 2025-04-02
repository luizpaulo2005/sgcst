import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { BadRequestError } from '@/http/routes/_errors/bad-request-error'
import { UnauthorizedError } from '@/http/routes/_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Erro de validação.',
      errors: error.validation.map((validation) => {
        return {
          path: validation.params.issue.path[0],
          message: validation.params.issue.message,
          // @ts-expect-error - A propriedade "expected" existe em alguns casos.
          expected: validation.params.issue.expected,
          // @ts-expect-error - A propriedade "received" existe em alguns casos.
          received: validation.params.issue.received,
        }
      }),
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Erro interno do servidor.' })
}

export { errorHandler }

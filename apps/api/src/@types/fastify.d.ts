import 'fastify'

import type { Cargo } from '@sgcst/auth/src/cargos'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getCurrentUserRole(): Promise<Cargo>
  }
}

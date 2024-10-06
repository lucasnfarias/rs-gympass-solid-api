import { authenticate } from '@/http/controllers/authenticate'
import { profile } from '@/http/controllers/profile'
import { register } from '@/http/controllers/register'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  /* Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}

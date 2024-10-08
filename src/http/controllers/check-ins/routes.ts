import { create } from '@/http/controllers/check-ins/create'
import { history } from '@/http/controllers/check-ins/history'
import { metrics } from '@/http/controllers/check-ins/metrics'
import { validate } from '@/http/controllers/check-ins/validate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-ins/:checkInId/validate', validate)
}

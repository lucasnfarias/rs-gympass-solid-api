import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Check-In History Controller (e2e)', () => {
  const DEFAULT_LATITUDE = -25.4150172
  const DEFAULT_LONGITUDE = -49.2537338

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list check-ins history', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins/history')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      checkIns: [
        {
          gym_id: gym.id,
          user_id: user.id,
          created_at: expect.any(String),
          id: expect.any(String),
          validated_at: null,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
          created_at: expect.any(String),
          id: expect.any(String),
          validated_at: null,
        },
      ],
    })
  })
})

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Check-In Controller (e2e)', () => {
  const DEFAULT_LATITUDE = -25.4150172
  const DEFAULT_LONGITUDE = -49.2537338

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-in`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      checkIn: {
        created_at: expect.any(String),
        gym_id: expect.any(String),
        id: expect.any(String),
        user_id: expect.any(String),
        validated_at: null,
      },
    })
  })
})

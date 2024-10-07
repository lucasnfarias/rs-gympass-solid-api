import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile Controller (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const {
      body: { token },
    } = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      user: {
        id: expect.any(String),
        created_at: expect.any(String),
        email: 'johndoe@example.com',
        name: 'John Doe',
      },
    })
  })
})

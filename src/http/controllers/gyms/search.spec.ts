import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gyms Controller (e2e)', () => {
  const DEFAULT_LATITUDE = -25.4150172
  const DEFAULT_LONGITUDE = -49.2537338

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Some description',
        phone: '1199990000',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Some description',
        phone: '1199990000',
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'Javascript',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      gyms: [
        {
          description: 'Some description',
          id: expect.any(String),
          latitude: DEFAULT_LATITUDE.toString(),
          longitude: DEFAULT_LONGITUDE.toString(),
          phone: '1199990000',
          title: 'Javascript Gym',
        },
      ],
    })
  })
})

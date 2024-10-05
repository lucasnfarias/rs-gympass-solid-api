import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Fetch Nearby Gyms Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: FetchNearbyGymsUseCase

  const DEFAULT_LATITUDE = -25.4150172
  const DEFAULT_LONGITUDE = -49.2537338

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -25.5512469,
      longitude: -48.5521028,
    }) // approx. 72 km

    const { gyms } = await sut.execute({
      userLatitude: DEFAULT_LATITUDE,
      userLongitude: DEFAULT_LONGITUDE,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})

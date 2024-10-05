import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from '@/use-cases/search-gyms'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Search Gyms Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let sut: SearchGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym',
      }),
    ])
  })

  it('should be able to search gyms paginated ', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Javascript Gym 21',
      }),
      expect.objectContaining({
        title: 'Javascript Gym 22',
      }),
    ])
  })
})

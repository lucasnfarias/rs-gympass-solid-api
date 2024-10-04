import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '@/use-cases/create-gym'
import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Create Gym Use Case', () => {
  let gymRepository: InMemoryGymsRepository
  let sut: CreateGymUseCase

  const DEFAULT_LATITUDE = -25.4150172
  const DEFAULT_LONGITUDE = -49.2537338

  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Javascript Whey',
      description: null,
      phone: null,
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
    })

    expect(gym.id).toEqual(expect.any(String))
    expect(gym.title).toEqual('Javascript Whey')
    expect(gym.latitude).toEqual(new Decimal(DEFAULT_LATITUDE))
    expect(gym.longitude).toEqual(new Decimal(DEFAULT_LONGITUDE))
  })
})

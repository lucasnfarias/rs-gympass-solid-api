import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Check-in Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckInUseCase

  const DEFAULT_LATITUDE = -25.4150172
  const DEFAULT_LONGITUDE = -49.2537338

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Javascript Whey',
      description: '',
      phone: '',
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: DEFAULT_LATITUDE,
      userLongitude: DEFAULT_LONGITUDE,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: DEFAULT_LATITUDE,
      userLongitude: DEFAULT_LONGITUDE,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: DEFAULT_LATITUDE,
        userLongitude: DEFAULT_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: DEFAULT_LATITUDE,
      userLongitude: DEFAULT_LONGITUDE,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: DEFAULT_LATITUDE,
      userLongitude: DEFAULT_LONGITUDE,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    // you can use google maps to get this latitudes to be further than MAX_DISTANCE_IN_KILOMETERS
    await gymsRepository.create({
      id: 'far-away-gym-01',
      title: 'Very Far Far Away Gym',
      description: '',
      phone: '',
      latitude: -25.37621,
      longitude: -49.1877729,
    })

    await expect(() =>
      sut.execute({
        gymId: 'far-away-gym-01',
        userId: 'user-01',
        userLatitude: DEFAULT_LATITUDE,
        userLongitude: DEFAULT_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

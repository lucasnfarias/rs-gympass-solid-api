import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from '@/use-cases/check-in'
import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('Check-in Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckInUseCase

  const defaultLatitude = -25.4150172
  const defaultLongitude = -49.2537338

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.gyms.push({
      id: 'gym-01',
      title: 'Javascript Whey',
      description: '',
      phone: '',
      latitude: new Decimal(defaultLatitude),
      longitude: new Decimal(defaultLongitude),
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
      userLatitude: defaultLatitude,
      userLongitude: defaultLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: defaultLatitude,
      userLongitude: defaultLongitude,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: defaultLatitude,
        userLongitude: defaultLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: defaultLatitude,
      userLongitude: defaultLongitude,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: defaultLatitude,
      userLongitude: defaultLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.gyms.push({
      id: 'far-away-gym-01',
      title: 'Very Far Far Away Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-25.37621),
      longitude: new Decimal(-49.1877729),
    })

    await expect(() =>
      sut.execute({
        gymId: 'far-away-gym-01',
        userId: 'user-01',
        userLatitude: defaultLatitude,
        userLongitude: defaultLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})

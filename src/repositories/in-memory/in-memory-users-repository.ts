import { UsersRepository } from '@/repositories/users-repository'
import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id)

    if (!user) return null

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) return null

    return user
  }

  async create({ name, email, password_hash }: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name,
      email,
      password_hash,
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }
}

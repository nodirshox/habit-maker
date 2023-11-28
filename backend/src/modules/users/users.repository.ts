import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async deleteUser(userId: string) {
    const operations = []
    const habits = await this.prisma.habit.findMany({
      where: { userId },
      select: { id: true },
    })
    const habitIds = habits.map((habit) => habit.id)

    operations.push(
      this.prisma.activity.deleteMany({
        where: {
          habitId: {
            in: habitIds,
          },
        },
      }),
    )

    operations.push(
      this.prisma.habit.deleteMany({
        where: { userId },
      }),
    )

    operations.push(this.prisma.user.delete({ where: { id: userId } }))

    return this.prisma.$transaction(operations)
  }
}

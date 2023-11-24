import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { Habit } from '@prisma/client'
import {
  CreateHabitDto,
  UpdateHabitDto,
} from '@/modules/habits/dto/create-habit.dto'

@Injectable()
export class HabitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createHabit(body: CreateHabitDto, userId: string): Promise<Habit> {
    return this.prisma.habit.create({
      data: {
        title: body.title,
        description: body.description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }

  async findHabitsByUser(userId: string): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { activities: true },
    })
  }

  async findHabitById(habitId: string): Promise<Habit | null> {
    return this.prisma.habit.findUnique({
      where: { id: habitId },
    })
  }

  async findHabitByIdWithActivies(habitId: string): Promise<Habit | null> {
    return this.prisma.habit.findUnique({
      where: { id: habitId },
      include: { activities: true },
    })
  }

  async updateHabit(habitId: string, body: UpdateHabitDto): Promise<Habit> {
    return this.prisma.habit.update({
      where: { id: habitId },
      data: {
        title: body.title,
        description: body.description,
      },
    })
  }

  async deleteHabit(habitId: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.activity.deleteMany({ where: { habitId } }),
      this.prisma.habit.delete({ where: { id: habitId } }),
    ])
  }
}

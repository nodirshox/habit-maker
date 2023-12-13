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
        color: body.color,
        user: {
          connect: {
            id: userId,
          },
        },
        repetition: {
          create: {
            weekdays:
              body.repetition.weekdays?.map((day) => {
                return {
                  weekday: day.weekday,
                  isSelected: day.isSelected,
                }
              }) || [],
            numberOfDays: body.repetition.numberOfDays || 0,
            notifyTime: body.repetition.notifyTime,
            showNotification: body.repetition.showNotification,
          },
        },
      },
    })
  }

  async findHabitsByUser(userId: string) {
    return this.prisma.habit.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        color: true,
        repetition: true,
        createdAt: true,
        activities: {
          select: {
            date: true,
          },
        },
      },
    })
  }

  async findHabitById(habitId: string) {
    return this.prisma.habit.findUnique({
      where: { id: habitId },
      include: {
        activities: true,
        repetition: true,
      },
    })
  }

  async findHabitByIdWithActivies(habitId: string) {
    return this.prisma.habit.findUnique({
      where: { id: habitId },
      select: {
        id: true,
        title: true,
        color: true,
        repetition: true,
        createdAt: true,
        activities: {
          select: {
            date: true,
          },
        },
      },
    })
  }

  async updateHabit(habitId: string, body: UpdateHabitDto) {
    await this.findHabitById(habitId)
    return this.prisma.habit.update({
      where: { id: habitId },
      data: {
        title: body.title,
        color: body.color,
        repetition: {
          delete: {},
          create: {
            weekdays:
              body.repetition.weekdays?.map((day) => {
                return {
                  weekday: day.weekday,
                  isSelected: day.isSelected,
                }
              }) || [],
            numberOfDays: body.repetition.numberOfDays || 0,
            notifyTime: body.repetition.notifyTime,
            showNotification: body.repetition.showNotification,
          },
        },
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

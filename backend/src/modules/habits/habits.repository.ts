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
        repetitions: {
          create: {
            weekdays:
              body.weekdays?.map((day) => {
                return {
                  weekday: day.day,
                  isSelected: day.isSelected,
                }
              }) || '',
            numberOfDays: body.numberOfDays || 0,
            notifyTime: body.notifyTime,
            showNotification: body.showNotification,
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
        repetitions: true,
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
        repetitions: true,
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
        repetitions: true,
        createdAt: true,
        activities: {
          select: {
            date: true,
          },
        },
      },
    })
  }

  async updateHabit(habitId: string, body: UpdateHabitDto): Promise<Habit> {
    return this.prisma.habit.update({
      where: { id: habitId },
      data: {
        title: body.title,
        color: body.color,
        repetitions: {
          deleteMany: {
            habitId,
          },
          create: {
            weekdays: body.weekdays.map((day) => {
              return {
                weekday: day.day,
                isSelected: day.isSelected,
              }
            }),
            numberOfDays: body.numberOfDays,
            notifyTime: body.notifyTime,
            showNotification: body.showNotification,
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

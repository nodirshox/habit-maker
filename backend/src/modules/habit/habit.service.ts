import { PrismaService } from '@/core/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateHabitDto, UpdateHabitDto } from './dto/create-habit.dto'
import { IUser } from '../users/dto/user.interface'
import { HabitResponseDto } from './dto/habit-response.dto'

@Injectable()
export class HabitService {
  constructor(private readonly prisma: PrismaService) {}

  async createHabit(
    body: CreateHabitDto,
    user: IUser,
  ): Promise<CreateHabitDto> {
    return this.prisma.habit.create({
      data: {
        title: body.title,
        description: body.description,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })
  }

  async getAllHabits(userId: string): Promise<HabitResponseDto[]> {
    return await this.prisma.habit.findMany({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        activities: true,
      },
    })
  }
  async getHabitById(
    habitId: string,
    userId: string,
  ): Promise<HabitResponseDto> {
    const existingHabit = await this.prisma.habit.findUnique({
      where: {
        id: habitId,
        user: {
          id: userId,
        },
      },
    })

    if (!existingHabit) {
      throw new BadRequestException(`Habit does not exist`)
    }
    return existingHabit
  }
  async updateHabitById(
    habitId: string,
    query: UpdateHabitDto,
    userId: string,
  ): Promise<HabitResponseDto> {
    await this.getHabitById(habitId, userId)

    return await this.prisma.habit.update({
      where: {
        id: habitId,
      },
      data: {
        title: query.title,
        description: query.description,
      },
    })
  }

  async deleteHabitById(
    habitId: string,
    userId: string,
  ): Promise<HabitResponseDto> {
    await this.getHabitById(habitId, userId)
    return await this.prisma.habit.delete({
      where: {
        id: habitId,
      },
    })
  }
}

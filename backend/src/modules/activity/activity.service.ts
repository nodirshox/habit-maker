import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { HabitService } from '../habit/habit.service'
import { CreateActivityDto } from './dto/create-activity.dto'

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly habitService: HabitService,
  ) {}

  async createActivity(
    body: CreateActivityDto,
    userId: string,
  ): Promise<CreateActivityDto> {
    const habit = await this.habitService.getHabitById(body.habitId, userId)
    return this.prisma.activity.create({
      data: {
        createdAt: body.createdAt,
        habit: {
          connect: {
            id: habit.id,
          },
        },
      },
    })
  }
}

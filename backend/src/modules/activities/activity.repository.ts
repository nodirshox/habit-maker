import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { Activity } from '@prisma/client'
import { CreateActivityDto } from '@/modules/activities/dto/create-activity.dto'
import { HTTP_MESSAGES } from '@/consts/http-messages'

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createActivity(body: CreateActivityDto): Promise<Activity> {
    const date = new Date(body.date)
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    )
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    )

    const existingActivity = await this.prisma.activity.findFirst({
      where: {
        date: {
          gte: startDate.toISOString(),
          lt: endDate.toISOString(),
        },
        habitId: body.habitId,
      },
    })

    if (existingActivity) {
      throw new HttpException(
        HTTP_MESSAGES.ACTIVITY_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
      )
    }

    return this.prisma.activity.create({
      data: {
        date: new Date(body.date),
        habit: {
          connect: {
            id: body.habitId,
          },
        },
      },
    })
  }

  async findActivityById(activityId: string) {
    return this.prisma.activity.findUnique({
      where: { id: activityId },
    })
  }

  async getAllActivities(userId: string) {
    return this.prisma.activity.findMany({
      where: {
        habit: {
          userId,
        },
      },
    })
  }

  async deleteActivity(activityId: string) {
    return this.prisma.activity.delete({
      where: {
        id: activityId,
      },
    })
  }
}

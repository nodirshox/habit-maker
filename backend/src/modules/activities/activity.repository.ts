import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/core/prisma/prisma.service'
import { Activity } from '@prisma/client'
import { CreateActivityDto } from '@/modules/activities/dto/create-activity.dto'
import { HTTP_MESSAGES } from '@/consts/http-messages'

@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createActivity(body: CreateActivityDto): Promise<Activity> {
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

  async deleteActivity(activityId: string) {
    return this.prisma.activity.delete({
      where: {
        id: activityId,
      },
    })
  }
}

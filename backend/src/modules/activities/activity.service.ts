import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateActivityDto } from '@/modules/activities/dto/create-activity.dto'
import { ActivityRepository } from '@/modules/activities/activity.repository'
import { HabitsService } from '@/modules/habits/habits.service'
import { HTTP_MESSAGES } from '@/consts/http-messages'

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly habitService: HabitsService,
  ) {}

  async createActivity(body: CreateActivityDto, userId: string) {
    await this.habitService.ensureHabitExistsAndBelongsToUser(
      body.habitId,
      userId,
    )
    const activity = await this.activityRepository.createActivity(body)
    return activity
  }

  async getAllActivities(userId: string) {
    return this.activityRepository.getAllActivities(userId)
  }

  async deleteActivity(activityId: string) {
    const activity = await this.activityRepository.findActivityById(activityId)

    if (!activity) {
      throw new BadRequestException(HTTP_MESSAGES.ACTIVITY_NOT_FOUND)
    }
    await this.activityRepository.deleteActivity(activityId)

    return {
      message: `Activity with ID = ${activityId} is deleted successfully`,
    }
  }
}

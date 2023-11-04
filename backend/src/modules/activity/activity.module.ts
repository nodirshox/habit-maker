import { Module } from '@nestjs/common'
import { ActivityService } from './activity.service'
import { PrismaService } from '@/core/prisma/prisma.service'
import { ActivityController } from './activity.controller'
import { HabitService } from '../habit/habit.service'

@Module({
  providers: [ActivityService, PrismaService, HabitService],
  controllers: [ActivityController],
})
export class ActivityModule {}

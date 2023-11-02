import { Module } from '@nestjs/common'
import { HabitService } from './habit.service'
import { HabitController } from './habit.controller'
import { PrismaService } from '@/core/prisma/prisma.service'

@Module({
  providers: [HabitService, PrismaService],
  controllers: [HabitController],
})
export class HabitModule {}

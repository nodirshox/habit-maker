import { Module } from '@nestjs/common'
import { UsersModule } from '@/modules/users/users.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { CoreModule } from '@/core/core.module'
import { HabitModule } from './modules/habit/habit.module'
import { ActivityModule } from './modules/activity/activity.module'
@Module({
  imports: [UsersModule, AuthModule, CoreModule, HabitModule, ActivityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

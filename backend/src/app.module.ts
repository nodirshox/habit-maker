import { Module } from '@nestjs/common'
import { UsersModule } from '@/modules/users/users.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { CoreModule } from '@/core/core.module'
import { HabitsModule } from '@/modules/habits/habits.module'
import { ActivityModule } from '@/modules/activities/activity.module'
@Module({
  imports: [UsersModule, AuthModule, CoreModule, HabitsModule, ActivityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { UsersModule } from '@/modules/users/users.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { CoreModule } from '@/core/core.module'
@Module({
  imports: [UsersModule, AuthModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { UsersController } from '@/modules/users/users.controller'
import { UsersService } from '@/modules/users/users.service'
import { CoreModule } from '@/core/core.module'
import { UsersRepository } from '@/modules/users/users.repository'

@Module({
  imports: [CoreModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

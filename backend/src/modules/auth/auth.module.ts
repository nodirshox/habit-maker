import { Module } from '@nestjs/common'
import { AuthController } from '@/modules/auth/auth.controller'
import { AuthService } from '@/modules/auth/auth.service'
import { CoreModule } from '@/core/core.module'
import { JwtStrategy } from './auth.strategy'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    CoreModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

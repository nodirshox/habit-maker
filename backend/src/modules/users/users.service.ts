import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { IUser } from '@/modules/users/dto/user.interface'
import { GetProfileResponseDto } from './dto/get-profile.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: IUser): Promise<GetProfileResponseDto> {
    const where: Prisma.UserWhereUniqueInput = {
      id: user.id,
    }
    return this.prisma.user.findUnique({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}

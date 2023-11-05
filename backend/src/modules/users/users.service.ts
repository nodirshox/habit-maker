import { PrismaService } from '@/core/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { GetProfileResponseDto } from './dto/get-profile.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<GetProfileResponseDto> {
    const where: Prisma.UserWhereUniqueInput = {
      id: userId,
    }
    return await this.prisma.user.findUnique({
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

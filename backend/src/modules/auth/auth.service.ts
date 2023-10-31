import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@/core/prisma/prisma.service'
import { UtilsService } from '@/core/utils/utils.service'
import { LoginResponseDto } from '@/modules/auth/dto/login-response.dto'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { Prisma, User } from '@prisma/client'
import {
  GenerateLinkDto,
  GenerateLinkResposeDto,
} from '@/modules/auth/dto/generate-link.dto'
import { randomBytes } from 'crypto'
import {
  RestoreAccountDto,
  RestoreAccountResponseDto,
} from '@/modules/auth/dto/restore-account.dto'
import { RESTORE_LINK_DURATION_MINUTES } from '@/consts/restore-password'

@Injectable()
export class AuthService {
  constructor(
    private utils: UtilsService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(body: LoginDto): Promise<LoginResponseDto> {
    const where: Prisma.UserWhereInput = {
      email: body.email,
    }
    const user: User = await this.prisma.user.findFirst({
      where,
    })
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: HTTP_MESSAGES.USER_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const isCorrectPass = await this.utils.compareHash(
      body.password,
      user.password,
    )
    if (!isCorrectPass) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: HTTP_MESSAGES.WRONG_PASSWORD,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    delete user.password
    const payload = { id: user.id, role: user.role }

    const accessToken = this.jwtService.sign(payload)
    return {
      user,
      token: { accessToken },
    }
  }

  async generateRestoreLink(
    body: GenerateLinkDto,
  ): Promise<GenerateLinkResposeDto> {
    const where: Prisma.UserWhereInput = {
      email: body.email,
    }
    const user: User = await this.prisma.user.findFirst({
      where,
    })
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: HTTP_MESSAGES.USER_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      )
    }

    const token = randomBytes(64).toString('base64url')
    await this.prisma.restoreAccountToken.upsert({
      where: {
        id: user.id,
      },
      create: {
        id: user.id,
        email: body.email,
        token: token,
      },
      update: {
        email: body.email,
        token: token,
        createdAt: new Date().toISOString(),
      },
    })

    // send link
    const link = `${process.env.BACKEND_API}/v1/restore-account?token=${token}`
    console.log(`Link: ${link} is sent to ${body.email}`)
    return {
      message: HTTP_MESSAGES.RESTORE_LINK_SENT,
    }
  }

  async restoreAccount(
    body: RestoreAccountDto,
  ): Promise<RestoreAccountResponseDto> {
    const token = await this.prisma.restoreAccountToken.findFirst({
      where: {
        token: body.token,
      },
    })

    if (!token) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: HTTP_MESSAGES.RESTOR_LINK_TOKEN_NOT_FOUND,
        },
        HttpStatus.BAD_REQUEST,
      )
    } else if (
      (new Date().getTime() - token.createdAt.getTime()) / (60 * 1000) >
      RESTORE_LINK_DURATION_MINUTES
    ) {
      await this.prisma.restoreAccountToken.deleteMany({
        where: {
          id: token.id,
        },
      })
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: HTTP_MESSAGES.RESTOR_LINK_EXPIRED,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    await this.prisma.restoreAccountToken.deleteMany({
      where: {
        id: token.id,
      },
    })
    const user = await this.prisma.user.findUnique({
      where: {
        email: token.email,
      },
    })
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: HTTP_MESSAGES.USER_NOT_FOUND,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const hashPassword = await this.utils.generateBcrypt(body.password)
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashPassword,
      },
    })
    return {
      message: HTTP_MESSAGES.PASSWORD_UPDATED,
    }
  }
}

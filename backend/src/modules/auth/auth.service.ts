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
import { RESTORE_LINK_DURATION_MINUTES } from '@/consts/registration'
import {
  GenerateRegistrationOtp,
  VerifyRegistrationOtp,
} from '@/modules/auth/dto/registration.dto'
import { EmailService } from '@/core/email/email.service'

@Injectable()
export class AuthService {
  constructor(
    private utils: UtilsService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
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
        createdAt: new Date(),
      },
    })

    const link = `${process.env.BACKEND_API}/v1/restore-account?token=${token}`
    await this.emailService.sendValidationLink(body.email, link)

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

  async generateRegistrationOtp(body: GenerateRegistrationOtp) {
    const email = body.email

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: HTTP_MESSAGES.EMAIL_IS_EXISTS,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const otp = this.utils.generateOtp()
    await this.emailService.sendRegistrationOtp(body.email, otp)

    const result = await this.prisma.verificationCodes.upsert({
      where: { email },
      update: {
        otp: otp,
        password: await this.utils.generateBcrypt(body.password),
      },
      create: {
        otp: otp,
        email,
        password: await this.utils.generateBcrypt(body.password),
      },
    })

    return { token: result.id }
  }

  async verifyRegistrationOtp(body: VerifyRegistrationOtp) {
    try {
      const verificationCode = await this.prisma.verificationCodes.findUnique({
        where: {
          id: body.token,
        },
      })

      if (!verificationCode) throw new Error('OTP not found')

      if (this.utils.isOtpExpired(verificationCode.createdAt)) {
        await this.prisma.verificationCodes.delete({
          where: { id: body.token },
        })
        throw new Error('OTP is expired')
      }

      if (body.otp !== verificationCode.otp) {
        throw new Error('Incorrect OTP')
      }

      const deleteVerificationCode = this.prisma.verificationCodes.delete({
        where: { id: verificationCode.id },
      })
      const createUser = this.prisma.user.create({
        data: {
          firstName: 'New',
          lastName: 'User',
          email: verificationCode.email,
          password: verificationCode.password,
        },
      })
      const result = await this.prisma.$transaction([
        deleteVerificationCode,
        createUser,
      ])
      const user = result[1]

      delete user.password
      const payload = { id: user.id, role: user.role }
      const accessToken = this.jwtService.sign(payload)

      return { user, accessToken }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}

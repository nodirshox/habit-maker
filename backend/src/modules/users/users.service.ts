import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { GetUserResponseDto } from '@/modules/users/dto/get-user.dto'
import { UsersRepository } from '@/modules/users/users.repository'
import { HTTP_MESSAGES } from '@/consts/http-messages'

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getUser(userId: string): Promise<GetUserResponseDto> {
    const user = await this.repository.getUser(userId)

    if (!user) {
      throw new HttpException(
        HTTP_MESSAGES.RESTOR_LINK_TOKEN_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      )
    }
    delete user.password

    return user
  }

  async deleteUser(userId: string) {
    await this.getUser(userId)
    await this.repository.deleteUser(userId)
    return { message: HTTP_MESSAGES.USER_DELETED }
  }
}

import { GetProfileResponseDto } from '@/modules/users/dto/get-profile.dto'
import { ApiProperty } from '@nestjs/swagger'

class UserInformation extends GetProfileResponseDto {}

export class TokenDto {
  @ApiProperty({ description: "User's access token" })
  accessToken: string

  @ApiProperty({ description: "User's refresh token" })
  refreshToken: string
}

export class LoginResponseDto {
  @ApiProperty({ description: 'User information' })
  user: UserInformation

  @ApiProperty({ description: 'User tokens' })
  token: TokenDto
}

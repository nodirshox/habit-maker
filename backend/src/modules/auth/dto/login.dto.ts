import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
    required: true,
    example: 'user@mail.com',
  })
  email: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'User password',
    required: true,
    example: 'password',
  })
  password: string
}

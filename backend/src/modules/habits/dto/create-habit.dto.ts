import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateHabitDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    required: true,
    example: 'No sugar',
  })
  title: string
}

export class UpdateHabitDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    required: true,
    example: 'No sugar',
  })
  title: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateHabitDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    required: true,
    example: 'No sugar',
  })
  title: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Description',
    required: false,
    example: 'Eating healthy and no sugar based food for 30 days',
  })
  description?: string
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

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Description',
    required: false,
    example: 'Eating healthy and no sugar based food for 30 days',
  })
  description?: string
}

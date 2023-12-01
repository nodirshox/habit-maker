import { ApiProperty } from '@nestjs/swagger'
import { Weekdays } from '@prisma/client'
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
} from 'class-validator'

export class CreateHabitDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name',
    required: true,
    example: 'No sugar',
  })
  title: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Color',
    required: true,
    example: '#ddd',
  })
  color: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ApiProperty({
    description: 'Repetitions',
    required: true,
    type: [String],
    example: [Weekdays.MONDAY, Weekdays.WEDNESDAY, Weekdays.FRIDAY],
  })
  repetitions: Weekdays[]
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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Color',
    required: true,
    example: '#ddd',
  })
  color: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ApiProperty({
    description: 'Repetitions',
    required: true,
    type: [String],
    example: [Weekdays.MONDAY, Weekdays.WEDNESDAY, Weekdays.FRIDAY],
  })
  repetitions: Weekdays[]
}

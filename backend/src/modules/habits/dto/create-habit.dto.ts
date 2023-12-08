import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreateRepetitionDto {
  @IsArray()
  @ApiProperty({
    description: 'Weekdays',
    example: [
      { day: 'Monday', isSelected: false },
      { day: 'Tuesday', isSelected: false },
      { day: 'Wednesday', isSelected: false },
    ],
  })
  weekdays: { day: string; isSelected: boolean }[]

  @IsNumber()
  @ApiProperty({
    description: 'Number of Days',
    example: 7,
  })
  numberOfDays: number

  @IsString()
  @ApiProperty({
    description: 'Notification Time',
    example: '12:30',
  })
  notifyTime: string

  @IsBoolean()
  @ApiProperty({
    description: 'Show Notification',
    example: true,
  })
  showNotification: boolean
}

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

  @Type(() => CreateRepetitionDto)
  @ApiProperty({
    description: 'Repetition details',
    example: {
      weekdays: [
        { day: 'Monday', isSelected: false },
        { day: 'Tuesday', isSelected: false },
        { day: 'Wednesday', isSelected: false },
      ],
      numberOfDays: 7,
      notifyTime: '12:30',
      showNotification: true,
    },
  })
  repetition: CreateRepetitionDto
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

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Weekdays',
    required: true,
    // type: [{ day: String, isSelected: Boolean }],
    example: [
      { weekday: 'Monday', isSelected: false },
      { weekday: 'Tuesday', isSelected: false },
      { weekday: 'Wednesday', isSelected: false },
    ],
  })
  weekdays: { weekday: string; isSelected: boolean }[]

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Number of Days',
    required: true,
    example: 7,
  })
  numberOfDays: number

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Notification Time',
    required: true,
    example: '12:30',
  })
  notifyTime: string

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Show Notification',
    required: true,
    example: true,
  })
  showNotification: boolean
}

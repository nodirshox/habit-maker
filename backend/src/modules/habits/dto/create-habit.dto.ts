import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
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

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'WeekDays',
    required: true,
    // type: [{ day: String, isSelected: Boolean }],
    example: [
      { day: 'Monday', isSelected: false },
      { day: 'Tuesday', isSelected: false },
      { day: 'Wednesday', isSelected: false },
    ],
  })
  weekdays: { day: string; isSelected: boolean }[]

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Number of Days',
    required: true,
    example: 7,
  })
  numberOfDays: number

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Notification Time',
    required: true,
    example: '12:30',
  })
  notifyTime: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Show Notification',
    required: true,
    example: true,
  })
  showNotification: boolean
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

import { ApiProperty } from '@nestjs/swagger'

export class HabitResponseDto {
  @ApiProperty({ description: 'Habit Id' })
  id: string

  @ApiProperty({ description: 'Habit Id' })
  userId: string

  @ApiProperty({ description: 'Habit title', example: 'No Sugar' })
  title: string

  @ApiProperty({
    description: 'Habit Description',
    example: 'Healthy food and no sugar for 30 days challenge',
  })
  description?: string

  @ApiProperty({ description: 'Habit created time', example: new Date() })
  createdAt: Date

  @ApiProperty({
    description: 'Habit latest updated time',
    example: new Date(),
  })
  updatedAt: Date
}

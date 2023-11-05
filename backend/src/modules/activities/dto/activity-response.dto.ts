import { ApiProperty } from '@nestjs/swagger'

export class ActivityResponseDto {
  @ApiProperty({ description: 'Activity Id' })
  id: string

  @ApiProperty({ description: 'Activity created time', example: new Date() })
  createdAt: Date

  @ApiProperty({ description: 'Habit Id' })
  habitId: string
}

import { HabitResponseDto } from '@/modules/habits/dto/habit-response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class GetHabitsDto {
  @ApiProperty({ description: 'Habits' })
  habits: HabitResponseDto[]
}

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateActivityDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Activity Id',
    required: true,
    example: 'uuid',
  })
  habitId: string

  @ApiProperty({
    description: 'Date',
    example: new Date(),
  })
  createdAt: Date
}

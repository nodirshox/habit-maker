import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ActivityService } from './activity.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '@/decorators/user.decorator'
import { IUser } from '../users/dto/user.interface'
import { CreateActivityDto } from './dto/create-activity.dto'
import { ActivityResponseDto } from './dto/activity-response.dto'

@ApiTags('Activities')
@Controller({ path: 'activities', version: '1' })
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create habits' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ActivityResponseDto })
  @UseGuards(JwtAuthGuard)
  createHabits(
    @Body() body: CreateActivityDto,
    @User() user: IUser,
  ): Promise<CreateActivityDto> {
    return this.activityService.createActivity(body, user.id)
  }
}

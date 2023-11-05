import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ActivityService } from '@/modules/activities/activity.service'
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import { User } from '@/decorators/user.decorator'
import { IUser } from '@/modules/users/dto/user.interface'
import { CreateActivityDto } from '@/modules/activities/dto/create-activity.dto'
import { ActivityResponseDto } from '@/modules/activities/dto/activity-response.dto'

@ApiTags('Activities')
@ApiBearerAuth()
@Controller({ path: 'activities', version: '1' })
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create activity' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ActivityResponseDto })
  @UseGuards(JwtAuthGuard)
  createActivity(
    @Body() body: CreateActivityDto,
    @User() user: IUser,
  ): Promise<CreateActivityDto> {
    return this.activityService.createActivity(body, user.id)
  }
}

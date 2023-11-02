import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { HabitService } from './habit.service'
import { HabitResponseDto } from './dto/habit-response.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateHabitDto, UpdateHabitDto } from './dto/create-habit.dto'
import { User } from '@/decorators/user.decorator'
import { IUser } from '../users/dto/user.interface'

@ApiTags('Habits')
@Controller({ path: 'habits', version: '1' })
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create habits' })
  @ApiResponse({ status: HttpStatus.CREATED, type: HabitResponseDto })
  @UseGuards(JwtAuthGuard)
  createHabits(
    @User() user: IUser,
    @Body() body: CreateHabitDto,
  ): Promise<CreateHabitDto> {
    return this.habitService.createHabit(body, user)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get All habits' })
  @ApiResponse({ status: HttpStatus.OK, type: HabitResponseDto })
  @UseGuards(JwtAuthGuard)
  getAllHabits(@User() user: IUser): Promise<HabitResponseDto[]> {
    return this.habitService.getAllHabits(user)
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update habit by Id' })
  @ApiResponse({ status: HttpStatus.OK, type: HabitResponseDto })
  @UseGuards(JwtAuthGuard)
  updateHabitById(
    @User() user: IUser,
    @Param('id') id: string,
    @Query() query: UpdateHabitDto,
  ): Promise<HabitResponseDto> {
    return this.habitService.updateHabitById(id, query, user.id)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete habit by Id' })
  @ApiResponse({ status: HttpStatus.OK, type: HabitResponseDto })
  @UseGuards(JwtAuthGuard)
  deleteHabitById(
    @Param('id') habitId: string,
    @User() user: IUser,
  ): Promise<HabitResponseDto> {
    return this.habitService.deleteHabitById(habitId, user.id)
  }
}

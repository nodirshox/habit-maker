import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import {
  CreateHabitDto,
  UpdateHabitDto,
} from '@/modules/habits/dto/create-habit.dto'
import { HabitResponseDto } from '@/modules/habits/dto/habit-response.dto'
import { HTTP_MESSAGES } from '@/consts/http-messages'
import { HabitsRepository } from '@/modules/habits/habits.repository'

@Injectable()
export class HabitsService {
  constructor(private readonly habitsRepository: HabitsRepository) {}

  async createHabit(
    body: CreateHabitDto,
    userId: string,
  ): Promise<HabitResponseDto> {
    const habit = await this.habitsRepository.createHabit(body, userId)
    return habit
  }

  async getHabits(userId: string): Promise<HabitResponseDto[]> {
    const habits = await this.habitsRepository.findHabitsByUser(userId)
    return habits
  }

  async getHabit(habitId: string, userId: string): Promise<HabitResponseDto> {
    await this.ensureHabitExistsAndBelongsToUser(habitId, userId)
    const habit = await this.habitsRepository.findHabitByIdWithActivies(habitId)

    return habit
  }

  async updateHabit(
    habitId: string,
    body: UpdateHabitDto,
    userId: string,
  ): Promise<HabitResponseDto> {
    await this.ensureHabitExistsAndBelongsToUser(habitId, userId)
    const habit = await this.habitsRepository.updateHabit(habitId, body)
    return habit
  }

  async deleteHabit(habitId: string, userId: string): Promise<void> {
    await this.ensureHabitExistsAndBelongsToUser(habitId, userId)
    await this.habitsRepository.deleteHabit(habitId)
  }

  private async ensureHabitExistsAndBelongsToUser(
    habitId: string,
    userId: string,
  ): Promise<void> {
    const habit = await this.habitsRepository.findHabitById(habitId)

    if (!habit) {
      throw new BadRequestException(HTTP_MESSAGES.HABIT_NOT_FOUND)
    }

    if (habit.userId !== userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }
}
import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from '@/modules/auth/auth.service'
import { LoginDto } from '@/modules/auth/dto/login.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LoginResponseDto } from '@/modules/auth/dto/login-response.dto'
import { LoginWrongPasswordDto } from '@/modules/auth/dto/login-wrong-password.dto'
import { UserNotFoundDto } from '@/modules/auth/dto/user-not-found.dto'
import {
  GenerateLinkDto,
  GenerateLinkResposeDto,
} from '@/modules/auth/dto/generate-link.dto'
import {
  RestoreAccountDto,
  RestoreAccountErrorResponseDto,
  RestoreAccountResponseDto,
} from '@/modules/auth/dto/restore-account.dto'

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login into system' })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: LoginWrongPasswordDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: UserNotFoundDto })
  login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(body)
  }

  @Post('restore/generate-link')
  @ApiOperation({ summary: 'Generate restore account link' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: UserNotFoundDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: GenerateLinkResposeDto })
  generateRestoreLink(
    @Body() body: GenerateLinkDto,
  ): Promise<GenerateLinkResposeDto> {
    return this.authService.generateRestoreLink(body)
  }

  @Post('restore/password')
  @ApiOperation({ summary: 'Restore user account' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: RestoreAccountErrorResponseDto,
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: RestoreAccountResponseDto })
  restoreAccount(@Body() body: RestoreAccountDto) {
    return this.authService.restoreAccount(body)
  }
}

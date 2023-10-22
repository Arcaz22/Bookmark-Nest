import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto, signUpDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'Created New User',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'User not created. Try again',
  })
  @ApiConflictResponse({ description: 'The user already exists' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async signUp(@Body() signUp: signUpDto) {
    return this.authService.signUp(signUp);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in as a user' })
  @ApiOkResponse({ description: 'Sign in as a user' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({
    description: 'User not found or credentials incorrect',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signIn: signInDto) {
    return this.authService.signIn(signIn);
  }
}

import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserRequestDTO } from '../users/user-dto/create-user.dto';
import { AuthCredentialsRequestDTO } from './auth-dto/auth-credentials.dto';
import { AuthSignInResponseDTO } from './auth-dto/auth-sign-in.dto';
import { UserSerializationService } from '../users/users-serialization.service';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(SerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userSerializationService: UserSerializationService,
  ) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Register a user' })
  @HttpCode(204)
  signUp(@Body() createUserRequestDTO: CreateUserRequestDTO): Promise<void> {
    return this.authService.signUp(createUserRequestDTO);
  }

  @Post('/sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login as a user' })
  async signIn(
    @Body() authCredentialsRequestDTO: AuthCredentialsRequestDTO,
  ): Promise<AuthSignInResponseDTO> {
    const { user, accessToken } = await this.authService.signIn(
      authCredentialsRequestDTO,
    );

    return {
      data: this.userSerializationService.markSerializableValue(user),
      accessToken,
    };
  }
}

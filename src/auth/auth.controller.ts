import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserRequestDTO } from '../users/user-dto/create-user.dto';
import { User } from '../users/user.entity';
import { AuthCredentialsRequestDTO } from './auth-dto/auth-credentials.dto';
import { AuthSignInResponseDTO } from './auth-dto/auth-sign-in.dto';
import { UserSerializationService } from '../users/users-serialization.service';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
import { JaegerInterceptor } from '../common/interceptors/jaeger.interceptor';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { GetUser } from './decorators/get-auth-user.decorator';
import {
  UpdateAuthUserRequestDTO,
  UpdateAuthUserResponseDTO,
} from './user-dto/update-user.dto';
import { ChangeAuthUserPasswordRequestDTO } from './user-dto/change-user-password.dto';
import { ChangeAuthUserEmailRequestDTO } from './user-dto/change-user-email.dto';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(SerializerInterceptor)
@UseInterceptors(JaegerInterceptor)
export class AuthController {
  private logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userSerializationService: UserSerializationService,
  ) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Register a user' })
  @HttpCode(204)
  signUp(@Body() createUserRequestDTO: CreateUserRequestDTO): Promise<void> {
    this.logger.verbose(
      `Creating new user, DTO: ${JSON.stringify(
        hidePassword(createUserRequestDTO),
      )}`,
    );

    return this.authService.signUp(createUserRequestDTO);
  }

  @Post('/sign-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login as a user' })
  async signIn(
    @Body() authCredentialsRequestDTO: AuthCredentialsRequestDTO,
  ): Promise<AuthSignInResponseDTO> {
    this.logger.verbose(
      `Logging in with credentials, DTO: ${JSON.stringify(
        hidePassword(authCredentialsRequestDTO),
      )}`,
    );

    const { user, accessToken } = await this.authService.signIn(
      authCredentialsRequestDTO,
    );

    this.logger.verbose(
      `Credentials for new login. User: ${JSON.stringify(
        hideUserData(user),
      )}, accessToken: ${accessToken}`,
    );

    return {
      data: this.userSerializationService.markSerializableValue(user),
      accessToken,
    };
  }

  @Get('/verify-token')
  @HttpCode(204)
  @ApiOperation({ summary: 'Verify users accessToken validity' })
  @UseGuards(JwtAuthGuard)
  async verifyToken() {
    return undefined;
  }

  @Patch('/update')
  @ApiOperation({ summary: 'Update logged user data' })
  @UseGuards(JwtAuthGuard)
  async updateLoggedUser(
    @GetUser() { id, email }: User,
    @Body() updateUserRequestDTO: UpdateAuthUserRequestDTO,
  ): Promise<UpdateAuthUserResponseDTO> {
    this.logger.verbose(
      `Changing data for user email: ${email} with id ${id} to new data: ${JSON.stringify(
        updateUserRequestDTO,
      )}`,
    );
    const { user, accessToken } = await this.authService.updateUser(
      id.toHexString(),
      updateUserRequestDTO,
    );

    return {
      accessToken,
      data: this.userSerializationService.markSerializableValue(user),
    };
  }

  @Patch('/change-password')
  @ApiOperation({ summary: 'Change logged user password' })
  @UseGuards(JwtAuthGuard)
  async changeUserPassword(
    @GetUser() { id, email }: User,
    @Body() changeUserPasswordRequestDTO: ChangeAuthUserPasswordRequestDTO,
  ): Promise<UpdateAuthUserResponseDTO> {
    this.logger.verbose(
      `Changing passwrd for user email: ${email} with id ${id}`,
    );
    const { user, accessToken } = await this.authService.changePassword(
      id.toHexString(),
      changeUserPasswordRequestDTO,
    );

    return {
      accessToken,
      data: this.userSerializationService.markSerializableValue(user),
    };
  }

  @Patch('/change-email')
  @ApiOperation({ summary: 'Change logged user email' })
  @UseGuards(JwtAuthGuard)
  async changeUserEmail(
    @GetUser() { id, email }: User,
    @Body() changeUserEmailRequestDTO: ChangeAuthUserEmailRequestDTO,
  ): Promise<UpdateAuthUserResponseDTO> {
    this.logger.verbose(
      `Changing email for user email: ${email} with id ${id} to new email: ${changeUserEmailRequestDTO.newEmail}`,
    );
    const { user, accessToken } = await this.authService.changeEmail(
      id.toHexString(),
      changeUserEmailRequestDTO,
    );

    return {
      accessToken,
      data: this.userSerializationService.markSerializableValue(user),
    };
  }
}

type UserDataModelWithPassword =
  | AuthCredentialsRequestDTO
  | Partial<User>
  | CreateUserRequestDTO;

function hidePassword(
  authCredentialsData: UserDataModelWithPassword,
): UserDataModelWithPassword {
  return {
    ...authCredentialsData,
    password: '*********',
  };
}

function hideUserData(data: Partial<User>): Partial<User> {
  return {
    ...hidePassword(data),
    salt: '*********',
  };
}

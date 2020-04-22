import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
} from './user-dto/update-user.dto';
import { UsersService } from './users.service';
import { IdParamDto } from '../common/common-dto/id-param.dto';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
import {
  GetAllUsersResponseDTO,
  GetUserResponseDTO,
} from './user-dto/get-user.dto';
import { UserSerializationService } from './users-serialization.service';
import { ChangeUserPasswordRequestDTO } from './user-dto/change-user-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangeUserEmailRequestDTO } from './user-dto/change-user-email.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(SerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly userSerializationService: UserSerializationService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<GetAllUsersResponseDTO> {
    const users = await this.usersService.findAll();

    return {
      data: this.userSerializationService.markSerializableCollection(users),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async findUser(@Param() { id }: IdParamDto): Promise<GetUserResponseDTO> {
    const user = await this.usersService.findOne(id);

    return {
      data: this.userSerializationService.markSerializableValue(user),
    };
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Update user data' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async updateUser(
    @Param() { id }: IdParamDto,
    @Body() updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<UpdateUserResponseDTO> {
    const user = await this.usersService.updateUser(id, updateUserRequestDTO);

    return {
      data: this.userSerializationService.markSerializableValue(user),
    };
  }

  @Patch(':id/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @HttpCode(204)
  async changeUserPassword(
    @Param() { id }: IdParamDto,
    @Body() changeUserPasswordRequestDTO: ChangeUserPasswordRequestDTO,
  ): Promise<void> {
    return await this.usersService.changePassword(
      id,
      changeUserPasswordRequestDTO,
    );
  }

  @Patch(':id/change-email')
  @ApiOperation({ summary: 'Change user email' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async changeUserEmail(
    @Param() { id }: IdParamDto,
    @Body() changeUserEmailRequestDTO: ChangeUserEmailRequestDTO,
  ): Promise<GetUserResponseDTO> {
    const user = await this.usersService.changeEmail(
      id,
      changeUserEmailRequestDTO,
    );

    return {
      data: this.userSerializationService.markSerializableValue(user),
    };
  }
}

import {
  Body,
  Get,
  Inject,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
} from './user-dto/update-user.dto';
import { UsersService } from './users.service';
import { IdParamDTO } from '../common/common-dto/id-param.dto';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
import {
  GetAllUsersResponseDTO,
  GetUserResponseDTO,
} from './user-dto/get-user.dto';
import { UserSerializationService } from './users-serialization.service';
import { UserRole } from '../auth/user-roles/user-role';
import { Roles } from '../auth/user-roles/user-roles.decorator';
import { ControllerAuth } from '../auth/decorators/controller-auth.decorator';
import { JaegerInterceptor } from '../common/interceptors/jaeger.interceptor';

@ControllerAuth('users')
@UseInterceptors(SerializerInterceptor)
@UseInterceptors(JaegerInterceptor)
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
  async findUser(@Param() { id }: IdParamDTO): Promise<GetUserResponseDTO> {
    const user = await this.usersService.findOne(id);

    return {
      data: this.userSerializationService.markSerializableValue(user),
    };
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Update other user data' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Roles(UserRole.ADMIN)
  async updateOtherUser(
    @Param() { id }: IdParamDTO,
    @Body() updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<UpdateUserResponseDTO> {
    const user = await this.usersService.updateUser(id, updateUserRequestDTO);

    return {
      data: this.userSerializationService.markSerializableValue(user),
    };
  }
}

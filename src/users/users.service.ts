import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { isString } from 'lodash';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { GetUserDataDTO } from './user-dto/get-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserRequestDTO } from './user-dto/create-user.dto';
import { UpdateUserRequestDTO } from './user-dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly usersRepository: UserRepository,
  ) {}
  logger = new Logger(UsersService.name);

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(
    searchBy:
      | string
      | Partial<Record<keyof Omit<GetUserDataDTO, 'id'>, string>>,
    withException?: boolean,
  ): Promise<User> {
    const search = isString(searchBy) ? searchBy : { where: searchBy };

    this.logger.verbose(`Searching for a user: ${JSON.stringify(search)}`);

    const user = await this.usersRepository.findOne(search);

    if (withException && !user) {
      throw new NotFoundException(`User not found.`);
    }

    return user;
  }

  async signUp(newUser: CreateUserRequestDTO) {
    return await this.usersRepository.signUp(newUser);
  }

  async updateUser(
    id: string,
    updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<User> {
    const user = await this.findOne(id, true);

    Object.assign(user, updateUserRequestDTO);
    await user.save();

    return user;
  }
}

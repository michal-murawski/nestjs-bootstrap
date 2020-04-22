import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isString } from 'lodash';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { GetUserDataDTO } from './user-dto/get-user.dto';
import { CreateUserRequestDTO } from './user-dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeUserPasswordRequestDTO } from './user-dto/change-user-password.dto';
import { ChangeUserEmailRequestDTO } from './user-dto/change-user-email.dto';
import { UpdateUserRequestDTO } from './user-dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly usersRepository: UserRepository,
  ) {}
  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(
    searchBy:
      | string
      | Partial<Record<keyof Omit<GetUserDataDTO, 'id'>, string>>,
  ): Promise<User> {
    const search = isString(searchBy) ? searchBy : { where: searchBy };
    const user = await this.usersRepository.findOne(search);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async updateUser(
    id: string,
    updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserRequestDTO);
    await user.save();

    return user;
  }

  async signUp(createUser: CreateUserRequestDTO): Promise<void> {
    return await this.usersRepository.signUp(createUser);
  }

  async changePassword(
    id: string,
    {
      newPassword,
      currentPassword,
      confirmPassword,
    }: ChangeUserPasswordRequestDTO,
  ) {
    const user = await this.findOne(id);
    const isCurrentValid = await user.validatePassword(currentPassword);

    if (!isCurrentValid) {
      throw new ConflictException('Current password does not match');
    }

    if (!(newPassword === confirmPassword)) {
      throw new ConflictException(
        'Both new and confirm passwords must be the same',
      );
    }
    await user.update({ password: newPassword });
  }

  async changeEmail(
    id: string,
    { confirmEmail, newEmail }: ChangeUserEmailRequestDTO,
  ) {
    const areEqual = confirmEmail === newEmail;

    if (!areEqual) {
      throw new ConflictException('Emails no not match');
    }

    const takenEmail = await this.usersRepository.findOne({
      where: { email: newEmail },
    });

    if (takenEmail) {
      throw new ConflictException(`User with ${newEmail} already exists`);
    }

    const user = await this.findOne(id);
    await user.update({ email: newEmail });
    return user;
  }
}

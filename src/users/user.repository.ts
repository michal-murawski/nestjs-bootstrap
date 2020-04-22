import { EntityRepository, MongoRepository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserRequestDTO } from './user-dto/create-user.dto';
import { REPOSITORY_ERRORS } from '../common/errors/repository.errors';

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {
  async signUp(newUser: CreateUserRequestDTO): Promise<void> {
    const user = new User(newUser);
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(user.password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === REPOSITORY_ERRORS.DUPLICATE_KEY_ERROR) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}

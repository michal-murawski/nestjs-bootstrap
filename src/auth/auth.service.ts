import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserRequestDTO } from '../users/user-dto/create-user.dto';
import { AuthCredentialsRequestDTO } from './auth-dto/auth-credentials.dto';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { classToPlain } from 'class-transformer';
import { GetUserDataDTO } from '../users/user-dto/get-user.dto';
import { ChangeAuthUserPasswordRequestDTO } from './user-dto/change-user-password.dto';
import { ChangeAuthUserEmailRequestDTO } from './user-dto/change-user-email.dto';
import { UpdateAuthUserRequestDTO } from './user-dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authSignToken(user: User): Promise<string> {
    const payload: JwtPayload = classToPlain(user) as GetUserDataDTO; // data duplication but just for now
    return this.jwtService.sign(payload, {
      expiresIn: '30d',
    });
  }

  async signUp(newUser: CreateUserRequestDTO): Promise<void> {
    return this.userService.signUp(newUser);
  }

  async signIn(authCredentialsRequestDTO: AuthCredentialsRequestDTO) {
    const user = await this.validateUser(authCredentialsRequestDTO);
    const accessToken = await this.authSignToken(user);

    return {
      user,
      accessToken,
    };
  }

  async validateUser({
    email,
    password,
  }: AuthCredentialsRequestDTO): Promise<User> {
    const user = await this.userService.findOne({ email }, true);
    const isValid = await user.validatePassword(password);

    if (!isValid) {
      throw new ForbiddenException('Invalid user password');
    }

    return user;
  }

  async changePassword(
    id: string,
    {
      newPassword,
      currentPassword,
      confirmPassword,
    }: ChangeAuthUserPasswordRequestDTO,
  ) {
    const user = await this.userService.findOne(id, true);
    const isCurrentValid = await user.validatePassword(currentPassword);

    if (!isCurrentValid) {
      throw new ConflictException('Current password does not match');
    }

    if (newPassword !== confirmPassword) {
      throw new ConflictException(
        'Both new and confirm passwords must be the same',
      );
    }
    await user.update({ password: await user.hashPassword(newPassword) });
    const accessToken = await this.authSignToken(user);

    return { user, accessToken };
  }

  async updateUser(id: string, updateUserData: UpdateAuthUserRequestDTO) {
    const user = await this.userService.updateUser(id, updateUserData);
    const accessToken = await this.authSignToken(user);

    return { user, accessToken };
  }

  async changeEmail(
    id: string,
    { confirmEmail, newEmail }: ChangeAuthUserEmailRequestDTO,
  ) {
    const areEqual = confirmEmail === newEmail;

    if (!areEqual) {
      throw new ConflictException('Emails no not match');
    }

    const takenEmail = await this.userService.findOne({ email: newEmail });

    if (takenEmail) {
      throw new ConflictException(`User with ${newEmail} already exists`);
    }

    const user = await this.userService.findOne(id);
    await user.update({ email: newEmail });
    const accessToken = await this.authSignToken(user);

    return { user, accessToken };
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserRequestDTO } from '../users/user-dto/create-user.dto';
import { AuthCredentialsRequestDTO } from './auth-dto/auth-credentials.dto';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(newUser: CreateUserRequestDTO): Promise<void> {
    return this.userService.signUp(newUser);
  }

  async signIn(authCredentialsRequestDTO: AuthCredentialsRequestDTO) {
    const user = await this.validateUser(authCredentialsRequestDTO);
    const payload: JwtPayload = { email: user.email, name: user.name }; // data duplication but just for now
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    return {
      user,
      accessToken,
    };
  }

  async validateUser({
    email,
    password,
  }: AuthCredentialsRequestDTO): Promise<User> {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid user password');
    }

    return user;
  }
}

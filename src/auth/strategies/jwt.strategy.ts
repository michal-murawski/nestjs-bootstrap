import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { getEnvConfigs } from '../../config/env.config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getEnvConfigs().ACCESS_SECRET,
    });
  }

  async validate({ email }: JwtPayload) {
    const user = await this.userService.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}

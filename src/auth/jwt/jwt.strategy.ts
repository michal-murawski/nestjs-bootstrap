import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { getEnvConfigs } from '../../config/env.config';
import { JwtPayload } from './jwt-payload.interface';
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

  async validate({ id }: JwtPayload) {
    return await this.userService.findOne(id, true);
  }
}

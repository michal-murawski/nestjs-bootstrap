import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { MatchesUserPassword } from '../decorators/MatchesUserPassword';

export class AuthCredentialsRequestDTO {
  @ApiProperty()
  @MatchesUserPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { MatchesUserPassword } from '../../users/decorators/MatchesUserPassword';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthCredentialsRequestDTO {
  @ApiProperty()
  @MatchesUserPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

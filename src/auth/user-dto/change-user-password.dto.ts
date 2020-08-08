import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchesUserPassword } from '../decorators/MatchesUserPassword';

export class ChangeAuthUserPasswordRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MatchesUserPassword()
  @IsString()
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MatchesUserPassword()
  @IsString()
  confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @MatchesUserPassword()
  @IsString()
  currentPassword: string;
}

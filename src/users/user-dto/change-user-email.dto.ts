import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeUserEmailRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  newEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  confirmEmail: string;
}

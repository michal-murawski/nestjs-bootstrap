import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetUserResponseDTO } from './get-user.dto';

export class UpdateUserRequestDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  phoneNumber?: string;
}
export class UpdateUserResponseDTO extends GetUserResponseDTO {}

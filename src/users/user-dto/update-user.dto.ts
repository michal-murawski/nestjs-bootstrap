import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetUserResponseDTO } from './get-user.dto';
import { UserRole } from '../../auth/user-roles/user-role';

// This will be an DTO for user update by ADMIN via dashboard
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserResponseDTO extends GetUserResponseDTO {}

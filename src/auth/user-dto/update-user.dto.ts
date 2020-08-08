import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthSignInResponseDTO } from '../auth-dto/auth-sign-in.dto';
import { UserRole } from '../user-roles/user-role';

// Update authorized user data DTO
export class UpdateAuthUserRequestDTO {
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
export class UpdateAuthUserResponseDTO extends AuthSignInResponseDTO {}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Serializable } from '../../common/services/serializer.service';
import { UserRole } from '../../auth/user-roles/user-role';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUserDataDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}

export class GetUserResponseDTO {
  @ApiProperty({ type: () => GetUserDataDTO })
  data: Serializable<GetUserDataDTO>;
}

export class GetAllUsersResponseDTO {
  @ApiProperty({ type: () => [GetUserDataDTO] })
  data: Serializable<GetUserDataDTO[]>;
}

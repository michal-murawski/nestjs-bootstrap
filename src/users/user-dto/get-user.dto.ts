import { ApiProperty } from '@nestjs/swagger';
import { Serializable } from '../../common/services/serializer.service';

export class GetUserDataDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  dashboards?: any;
}

export class GetUserResponseDTO {
  @ApiProperty({ type: () => GetUserDataDTO })
  data: Serializable<GetUserDataDTO>;
}

export class GetAllUsersResponseDTO {
  @ApiProperty({ type: () => [GetUserDataDTO] })
  data: Serializable<GetUserDataDTO[]>;
}

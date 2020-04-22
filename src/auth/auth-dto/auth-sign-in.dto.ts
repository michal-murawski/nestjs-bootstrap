import { ApiProperty } from '@nestjs/swagger';
import { Serializable } from '../../common/services/serializer.service';
import {
  GetUserDataDTO,
  GetUserResponseDTO,
} from '../../users/user-dto/get-user.dto';

export class AuthSignInResponseDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: () => GetUserResponseDTO })
  data: Serializable<GetUserDataDTO>;
}

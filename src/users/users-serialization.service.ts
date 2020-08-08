import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { BaseSerializerService } from '../common/services/serializer.service';
import { GetUserDataDTO } from './user-dto/get-user.dto';
import { classToPlain } from 'class-transformer';

@Injectable()
export class UserSerializationService extends BaseSerializerService<
  User,
  GetUserDataDTO
> {
  public async serialize(user: User): Promise<GetUserDataDTO> {
    return (classToPlain(user) as any) as GetUserDataDTO;
  }
}

import { IsNotEmpty, IsString } from 'class-validator';

export class IdParamDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Serializable } from '../../common/services/serializer.service';
import { Grid } from '../dashboard.entity';

export class GetDashboardDataDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  ownerId?: string;

  @ApiPropertyOptional()
  folderId?: string;

  @ApiProperty()
  grid: Grid;
}

export class GetDashboardResponseDTO {
  @ApiProperty({ type: () => GetDashboardDataDTO })
  data: Serializable<GetDashboardDataDTO>;
}

export class GetAllDashboardResponseDTO {
  @ApiProperty({ type: () => [GetDashboardDataDTO] })
  data: Serializable<GetDashboardDataDTO[]>;
}

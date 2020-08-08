import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Grid } from '../dashboard.entity';

export class UpdateHomeDashboardRequestDTO {
  @ApiPropertyOptional()
  @IsOptional()
  grid: Grid;
}

import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardRepository } from './dashboard.repository';
import { DashboardSerializationService } from './dashboard-serialization.service';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardRepository])],
  providers: [DashboardsService, DashboardSerializationService],
  controllers: [DashboardsController],
})
export class DashboardsModule {}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'typeorm';
import { DashboardRepository } from './dashboard.repository';
import { Dashboard } from './dashboard.entity';
import { CreateDashboardRequestDTO } from './dashboard-dto/create-dashboard.dto';
import { User } from '../users/user.entity';
import { UpdateDashboardRequestDTO } from './dashboard-dto/update-dashboard-r-q.dto';

@Injectable()
export class DashboardsService {
  constructor(
    @InjectRepository(Dashboard)
    private readonly dashboardRepository: DashboardRepository,
  ) {}

  async getDashboard(id: string) {
    const dashboard = await this.dashboardRepository.getDashboard(id);
    if (!dashboard) {
      throw new NotFoundException(`Dashboard with id: ${id} not found`);
    }
    return dashboard;
  }

  async getDashboards() {
    return await this.dashboardRepository.getDashboards();
  }

  async createDashboard(
    user: User,
    createDashboardRequestDTO: CreateDashboardRequestDTO,
  ): Promise<Dashboard> {
    try {
      const dashboard = new Dashboard({
        ...createDashboardRequestDTO,
        canvas: false,
        home: false,
      });
      dashboard.ownerId = user.id.toHexString();
      dashboard.grid = dashboard.grid || {
        layouts: [],
        widgets: [],
      };
      await dashboard.save();

      return dashboard;
    } catch (error) {}
  }

  async updateDashboard(
    id: string,
    updateDashboardRequestDTO: UpdateDashboardRequestDTO,
  ): Promise<Dashboard> {
    const dashboard = await this.getDashboard(id);
    await dashboard.update(updateDashboardRequestDTO);
    return dashboard;
  }

  @Transaction()
  async deleteDashboards(dashboardIds: string[]) {
    for (const dashboardId of dashboardIds) {
      const dashboard = await this.getDashboard(dashboardId);

      await dashboard.remove();
    }
  }
}

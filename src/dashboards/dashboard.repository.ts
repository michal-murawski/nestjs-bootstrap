import { EntityRepository, MongoRepository } from 'typeorm';
import { Dashboard } from './dashboard.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Dashboard)
export class DashboardRepository extends MongoRepository<Dashboard> {
  private logger = new Logger(DashboardRepository.name);

  async getDashboards() {
    try {
      return await this.find();
    } catch (error) {
      this.logger.error('Failed to get dashboards', error.stack);
      throw error;
    }
  }

  async getDashboard(id: string): Promise<Dashboard | undefined> {
    try {
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to get dashboard for "ID: ${id}"`, error.stack);
      throw error;
    }
  }
}

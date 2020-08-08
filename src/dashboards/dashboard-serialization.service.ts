import { Injectable } from '@nestjs/common';
import { BaseSerializerService } from '../common/services/serializer.service';
import { classToPlain } from 'class-transformer';
import { Dashboard } from './dashboard.entity';
import { GetDashboardDataDTO } from './dashboard-dto/get-dashboard.dto';
import { User } from '../users/user.entity';
import { UserRole } from '../auth/user-roles/user-role';
import { matchRoles } from '../auth/user-roles/user-roles.guard';

@Injectable()
export class DashboardSerializationService extends BaseSerializerService<
  Dashboard,
  GetDashboardDataDTO
> {
  public async serialize(
    dashboard: Dashboard,
    user?: User,
  ): Promise<GetDashboardDataDTO> {
    let readOnly = true;

    if (user) {
      readOnly = !matchRoles(UserRole.REGULAR, user.role);
    }
    const mappedDashboard = classToPlain(dashboard) as any;

    return { ...mappedDashboard, readOnly } as GetDashboardDataDTO;
  }
}

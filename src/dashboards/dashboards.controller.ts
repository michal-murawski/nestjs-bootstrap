import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { DashboardsService } from './dashboards.service';
import { GetUser } from '../auth/decorators/get-auth-user.decorator';
import { User } from '../users/user.entity';
import { CreateDashboardRequestDTO } from './dashboard-dto/create-dashboard.dto';
import { UpdateDashboardRequestDTO } from './dashboard-dto/update-dashboard-r-q.dto';
import { IdParamDTO } from '../common/common-dto/id-param.dto';
import {
  GetAllDashboardResponseDTO,
  GetDashboardResponseDTO,
} from './dashboard-dto/get-dashboard.dto';
import { SerializerInterceptor } from '../common/interceptors/serializer.interceptor';
import { DashboardSerializationService } from './dashboard-serialization.service';
import { UserRole } from '../auth/user-roles/user-role';
import { Roles } from '../auth/user-roles/user-roles.decorator';
import { ControllerAuth } from '../auth/decorators/controller-auth.decorator';
import { JaegerInterceptor } from '../common/interceptors/jaeger.interceptor';

@ControllerAuth('dashboards')
@UseInterceptors(JaegerInterceptor)
@UseInterceptors(SerializerInterceptor)
export class DashboardsController {
  private logger = new Logger(DashboardsController.name);

  constructor(
    private readonly dashboardsService: DashboardsService,
    private readonly dashboardSerializationService: DashboardSerializationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all dashboards for logged user' })
  async getDashboards(): Promise<GetAllDashboardResponseDTO> {
    this.logger.verbose('Getting dashboards');

    const dashboards = await this.dashboardsService.getDashboards();
    return {
      data: this.dashboardSerializationService.markSerializableCollection(
        dashboards,
      ),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all dashboards for logged user' })
  async getDashboard(
    @Param() { id }: IdParamDTO,
  ): Promise<GetDashboardResponseDTO> {
    this.logger.verbose(`Getting dashboard with ID ${id}`);

    const dashboards = await this.dashboardsService.getDashboard(id);
    return {
      data: this.dashboardSerializationService.markSerializableValue(
        dashboards,
      ),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Add a new dashboard' })
  @Roles(UserRole.REGULAR)
  async createDashboard(
    @Body() createDashboardRequestDTO: CreateDashboardRequestDTO,
    @GetUser() user: User,
  ): Promise<GetDashboardResponseDTO> {
    this.logger.verbose(
      `Creating a new dashboard: ${JSON.stringify(createDashboardRequestDTO)}`,
    );

    const dashboard = await this.dashboardsService.createDashboard(
      user,
      createDashboardRequestDTO,
    );
    return {
      data: this.dashboardSerializationService.markSerializableValue(dashboard),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a single dashboard' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @Roles(UserRole.REGULAR)
  async updateDashboard(
    @Param() { id }: IdParamDTO,
    @Body() updateDashboardRequestDTO: UpdateDashboardRequestDTO,
  ): Promise<GetDashboardResponseDTO> {
    this.logger.verbose(
      `Updating a dashboard: ${JSON.stringify(
        updateDashboardRequestDTO,
      )} for id: ${id}`,
    );

    const dashboard = await this.dashboardsService.updateDashboard(
      id,
      updateDashboardRequestDTO,
    );
    return {
      data: this.dashboardSerializationService.markSerializableValue(dashboard),
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Deletes multiple dashboards' })
  @ApiParam({ name: 'ids', description: 'Dashboard IDs separated by comma' })
  @Roles(UserRole.REGULAR)
  async deleteDashboards(@Query('ids') ids: string): Promise<{ data: null }> {
    this.logger.verbose(`Deleting a dashboards with IDs: ${ids}`);

    await this.dashboardsService.deleteDashboards(ids.split(','));
    return {
      data: null,
    };
  }
}

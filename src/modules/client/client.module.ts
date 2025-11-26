import { Module } from '@nestjs/common';
import { ClientController } from './controller/client.controller';
import { ClientService } from './service/client.service';
import { ClientDashboardStackController } from './controller/client.dashboard.stack.controller';
import { ClientDashboardStack } from './service/client.dashboard.stack.services';
import { ProjectTimelineService } from './service/client.project_timeline.services';
import { ProjectTimelineController } from './controller/client.project_timeline.controller';
import { EmployeesActivityServices } from './service/client.employees_activity.services';
import { Employees_activityController } from './controller/client.employes_activity.controller';
import { ProjectStatusStack } from './service/client.project.status.services';
import { ProjectStatusStackController } from './controller/client.project.status.controller';
import { ClientDashboardOverdue_Project } from './service/client.dashboard.overedue.services';
import { ClientProjectOverdueController } from './controller/client.dashboard.overedue.controller';

@Module({
  controllers: [ClientController,ClientDashboardStackController,ProjectTimelineController,Employees_activityController,ProjectStatusStackController,ClientProjectOverdueController],
  providers: [ClientService,ClientDashboardStack,ProjectTimelineService,EmployeesActivityServices,ProjectStatusStack,ClientDashboardOverdue_Project],
})
export class ClientModule {}

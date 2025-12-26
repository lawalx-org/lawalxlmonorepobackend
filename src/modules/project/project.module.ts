import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { ReminderService } from '../notification/service/reminder';
import { SchedulerService } from '../notification/service/scheduler.service';
import { NotificationService } from '../notification/service/notification.service';
import { NotificationModule } from '../notification/notification.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { InfrastructureRepository } from '../infrastructure/infrastructure.repository';
import { InfrastructureNodeRepository } from '../infrastructure/infrastructure-node/infrastructure-node.repository';
import { InfrastructureProjectRepository } from '../infrastructure/infrastructure-project/infrastructure-project.repository';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
import { InfrastructureNodeService } from '../infrastructure/infrastructure-node/infrastructure-node.service';

@Module({
  imports: [NotificationModule, InfrastructureModule],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    SchedulerService,
    ReminderService,
    NotificationService,

    // here is our all infrustrucre
    InfrastructureRepository,
    InfrastructureNodeRepository,
    InfrastructureProjectRepository,
    // services
    InfrastructureService,
    InfrastructureNodeService,
  ],
  exports: [ReminderService],
})
export class ProjectModule {}

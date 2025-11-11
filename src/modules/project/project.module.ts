import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { ReminderService } from '../notification/service/reminder';
import { SchedulerService } from '../notification/service/scheduler.service';
import { NotificationService } from '../notification/service/notification.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [ProjectController],
  providers: [ProjectService,SchedulerService,ReminderService,NotificationService],
  exports: [ReminderService],
})
export class ProjectModule {}

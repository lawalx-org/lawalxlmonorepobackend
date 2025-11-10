import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { ReminderService } from '../notification/service/reminder';
import { SchedulerService } from '../notification/service/scheduler.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService,SchedulerService,ReminderService],
  exports: [ReminderService],
})
export class ProjectModule {}

import { EmployModule } from 'src/modules/employ/employ.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { ProgramModule } from 'src/modules/program/program.module';
import { ProjectModule } from 'src/modules/project/project.module';
import { SubmittedModule } from 'src/modules/submitted/submitted.module';

export const userBase = [
  ProgramModule,
  ProjectModule,
  NotificationModule,
  EmployModule,
  SubmittedModule,
];

import { EmployModule } from 'src/modules/employ/employ.module';
import { NotificationModule } from 'src/modules/notification/notification.module';
import { ProgramModule } from 'src/modules/program/program.module';
import { ProjectModule } from 'src/modules/project/project.module';
import { ManagerModule } from 'src/modules/manager/manager.module';

export const userBase = [
  ProgramModule,
  ProjectModule,
  NotificationModule,
  EmployModule,
  ManagerModule,
];

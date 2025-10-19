import { NotificationModule } from 'src/modules/notification/notification.module';
import { ProgramModule } from 'src/modules/program/program.module';
import { ProjectModule } from 'src/modules/project/project.module';

export const userBase = [ProgramModule, ProjectModule, NotificationModule];

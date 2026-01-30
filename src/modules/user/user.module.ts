import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { ConfigModule } from '@nestjs/config';
import { ManagerService } from './service/manager.service';
import { EmployeeService } from './service/employee.service';
import { ViewerService } from './service/viewer.service';
import { UserController } from './controller/user.controller';
import { NotificationModule } from '../notification/notification.module';
import { ClientEmployeeController } from './controller/employ.controller';
import { ClientManagerController } from './controller/manager.controller';
import { ClientViewerController } from './controller/viewer.controller';
import { ClientStaffEmployeeController } from './controller/employee.staff.controller';
import { StaffEmployeeService } from './service/employee..services';

@Module({
  controllers: [
    UserController,
    ClientEmployeeController,
    ClientManagerController,
    ClientViewerController,
    ClientStaffEmployeeController
  ],
  providers: [UserService, ManagerService, EmployeeService,StaffEmployeeService, ViewerService],
  exports: [UserService, ManagerService, EmployeeService, ViewerService],
  imports: [ConfigModule, NotificationModule],
})
export class UserModule {}

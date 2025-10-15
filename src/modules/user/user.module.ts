import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { ConfigModule } from '@nestjs/config';
import { ManagerService } from './service/manager.service';
import { EmployeeService } from './service/employee.service';
import { ViewerService } from './service/viewer.service';
import { UserController } from './controller/user.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [UserController],
  providers: [UserService, ManagerService, EmployeeService, ViewerService],
  exports: [UserService, ManagerService, EmployeeService, ViewerService],
  imports: [ConfigModule, NotificationModule],
})
export class UserModule {}

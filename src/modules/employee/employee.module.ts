import { Module } from '@nestjs/common';
import { EmployeeService } from './service/employee.service';
import { EmployeeController } from './controller/employee.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { ChartModule } from '../chart/chart.module';
import { SubmittedModule } from '../submitted/submitted.module';
import { EmployDashboardService } from './service/employ.dashboard.service';
import { EmployDashboardController } from './controller/employ.dashboard.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    SubmittedModule,
    ChartModule,
    NotificationModule,
  ],
  controllers: [EmployeeController, EmployDashboardController],
  providers: [EmployeeService, EmployDashboardService],
  exports: [EmployeeService],
})
export class EmployeeModule {}

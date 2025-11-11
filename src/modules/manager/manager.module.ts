import { Module } from '@nestjs/common';
import { ManagerController } from './controller/manager.controller';
import { ManagerService } from './service/manager.service';
import { ChartModule } from '../chart/chart.module';
import { ChartService } from '../chart/service/chart.service';

@Module({
  imports: [ChartModule],
  controllers: [ManagerController],
  providers: [ManagerService,ChartService],
})
export class ManagerModule {}

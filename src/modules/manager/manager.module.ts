import { Module } from '@nestjs/common';
import { ManagerController } from './controller/manager.controller';
import { ManagerService } from './service/manager.service';
import { ChartModule } from '../chart/chart.module';

@Module({
  imports: [ChartModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}

import { Module } from '@nestjs/common';
import { EmployController } from './controller/employ.controller';
import { EmployService } from './services/employ.service';
import { SubmittedModule } from '../submitted/submitted.module';
import { ChartModule } from '../chart/chart.module';
import { ChartController } from '../chart/controller/chart.controller';
import { ChartService } from '../chart/service/chart.service';


@Module({
  imports: [SubmittedModule,],
  controllers: [EmployController, ChartController],
  providers: [EmployService,ChartService],
})
export class EmployModule {}

import { Module } from '@nestjs/common';
import { EmployController } from './controller/employ.controller';
import { EmployService } from './services/employ.service';
import { SubmittedModule } from '../submitted/submitted.module';
import { ChartModule } from '../chart/chart.module';
import { ChartController } from '../chart/controller/chart.controller';
import { ChartService } from '../chart/service/chart.service';

@Module({
  imports: [SubmittedModule, ChartModule], // ✅ import module, don’t re-declare
  controllers: [EmployController], // ✅ only your own controller
  providers: [EmployService], // ✅ only your own service
})
export class EmployModule {}

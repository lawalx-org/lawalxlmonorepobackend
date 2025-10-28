import { Module } from '@nestjs/common';
import { EmployController } from './controller/employ.controller';
import { EmployService } from './services/employ.service';
import { SubmittedModule } from '../submitted/submitted.module';
import { ChartModule } from '../chart/chart.module';
import { ChartController } from '../chart/chart.controller';

@Module({
  imports: [SubmittedModule, ChartModule],
  controllers: [EmployController, ChartController],
  providers: [EmployService],
})
export class EmployModule {}

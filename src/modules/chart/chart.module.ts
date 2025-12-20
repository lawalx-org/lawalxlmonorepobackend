import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ChartController } from './controller/chart.controller';
import { ChartMainController } from './controller/chart.man.controller';
import { ChartService } from './service/chart.service';
import { ChartMainService } from './service/chart.main.service';


@Module({
  imports: [PrismaModule],
  controllers: [ChartMainController, ChartController],
  providers: [ChartService, ChartMainService,],
  exports: [ChartService], // ✅ export service so others can use it
})
export class ChartModule {}

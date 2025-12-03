import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { ChartController } from './controller/chart.controller';
import { ChartMainController } from './controller/chart.man.controller';
import { ChartService } from './service/chart.service';
import { ChartMainService } from './service/chart.main.service';
import { ChartsWizardController } from './controller/charts.wizard.controller';
import { ChartsWizardServices } from './service/charts.wizard.services';

@Module({
  imports: [PrismaModule],
  controllers: [ChartMainController, ChartController,ChartsWizardController],
  providers: [ChartService, ChartMainService,ChartsWizardServices],
  exports: [ChartService], // ✅ export service so others can use it
})
export class ChartModule {}

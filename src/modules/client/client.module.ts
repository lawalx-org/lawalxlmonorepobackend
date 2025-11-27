import { Module } from '@nestjs/common';
import { ClientController } from './controller/client.controller';
import { ClientService } from './service/client.service';

import { ClientDashboardController } from './controller/client.dashboard.controller';
import { ClientDashboardServices } from './service/client.dashboard.services';


@Module({
  controllers: [ClientController,ClientDashboardController],
  providers: [ClientService,ClientDashboardServices],
})
export class ClientModule {}

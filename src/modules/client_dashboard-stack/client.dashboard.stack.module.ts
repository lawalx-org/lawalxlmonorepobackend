import { Module } from '@nestjs/common';
import { ClientDashboardStackController } from './controller/client.dashboard.stack.controller';
import { ClientDashboardStack } from './services/client.dashboard.stack.services';


@Module({
  controllers: [ClientDashboardStackController],
  providers: [ClientDashboardStack],
})
export class Client_Dash_stakeModule {}

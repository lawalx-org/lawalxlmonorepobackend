import { Module } from '@nestjs/common';
import { ManagerController } from './controller/manager.controller';
import { ManagerService } from './service/manager.service';

@Module({
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}

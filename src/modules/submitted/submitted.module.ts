import { Module } from '@nestjs/common';
import { SubmittedController } from './controller/submitted.controller';
import { SubmittedService } from './service/submitted.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
   imports: [NotificationModule], 
  controllers: [SubmittedController],
  providers: [SubmittedService],
  exports: [SubmittedService],
})
export class SubmittedModule {}

import { Module } from '@nestjs/common';
import { SubmittedController } from './controller/submitted.controller';
import { SubmittedService } from './service/submitted.service';

@Module({
  controllers: [SubmittedController],
  providers: [SubmittedService],
  exports: [SubmittedService],
})
export class SubmittedModule {}

import { Module } from '@nestjs/common';
import { EmployController } from './controller/employ.controller';
import { EmployService } from './services/employ.service';

@Module({
  controllers: [EmployController],
  providers: [EmployService],
})
export class EmployModule {}

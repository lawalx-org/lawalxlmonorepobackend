import { Module } from '@nestjs/common';
import { EmployController } from './controller/employ.controller';
import { EmployService } from './services/employ.service';
import { SubmittedModule } from '../submitted/submitted.module';

@Module({
  imports: [SubmittedModule],
  controllers: [EmployController],
  providers: [EmployService],
})
export class EmployModule {}

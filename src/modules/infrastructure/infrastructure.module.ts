import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure.controller';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureService } from './infrastructure.service';

@Module({
  imports: [],
  controllers: [InfrastructureController],
  providers: [InfrastructureRepository, InfrastructureService],
})
export class InfrastructureModule {}

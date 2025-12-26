import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure.controller';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureNodeRepository } from './infrastructure-node/infrastructure-node.repository';
import { InfrastructureProjectRepository } from './infrastructure-project/infrastructure-project.repository';
import { InfrastructureService } from './infrastructure.service';
import { InfrastructureNodeService } from './infrastructure-node/infrastructure-node.service';

@Module({
  imports: [],
  controllers: [InfrastructureController],
  providers: [
    InfrastructureRepository,
    InfrastructureNodeRepository,
    InfrastructureProjectRepository,
    // services
    InfrastructureService,
    InfrastructureNodeService,
  ],
})
export class InfrastructureModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InfrastructureDto } from './dto/infrastructure.dto';
import { InfrastructureService } from './infrastructure.service';
import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
} from './dto/infrastructure.node.dto';

@ApiTags('Infrastructure')
@Controller('infrastructure')
export class InfrastructureController {
  constructor(private readonly service: InfrastructureService) {}

  @Post('projects')
  createProject(@Body() dto: InfrastructureDto) {
    return this.service.createProject(dto);
  }

  @Get('projects')
  getProjects() {
    // TODO: add pagination and sorting
    return this.service.findManyProjects();
  }

  @Get('projects/:projectId/nodes')
  getRootNodes(@Param('projectId') projectId: string) {
    return this.service.findRootNodes(projectId);
  }

  // nodes from here...
  @Post('nodes')
  createNode(@Body() dto: InfrastructureNodeDto) {
    return this.service.createNode(dto);
  }

  @Get('nodes/:nodeId/children')
  getChildren(@Param('nodeId') nodeId: string) {
    return this.service.findChildren(nodeId);
  }

  @Patch('nodes/:nodeId/progress')
  updateProgress(
    @Param('nodeId') nodeId: string,
    @Body() dto: UpdateInfrastructureNodeDto,
  ) {
    console.log(dto);
    return this.service.updateProgress(nodeId, dto.progress ? dto.progress : 0);
  }

  @Delete('nodes/:nodeId')
  deleteNode(@Param('nodeId') nodeId: string) {
    return this.service.deleteNode(nodeId);
  }
}

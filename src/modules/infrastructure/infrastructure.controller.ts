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
import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
} from './dto/infrastructure.node.dto';
import { InfrastructureProjectDto } from './dto/infrastructure.dto';
// import { InfrastructureProjectService } from './infrastructure-project/infrastructure-project.service';
import { InfrastructureNodeService } from './infrastructure-node/infrastructure-node.service';
import { priority } from './contants';
import { InfrastructureService } from './infrastructure.service';

// TODO: Proper error handling from controller
@ApiTags('Infrastructure')
@Controller('infrastructure')
export class InfrastructureController {
  constructor(
    private readonly service: InfrastructureService,
    // private readonly projectService: InfrastructureProjectService,
    private readonly nodeService: InfrastructureNodeService,
  ) {}

  // @Post('projects')
  // createProject(@Body() dto: InfrastructureProjectDto) {
  //   this.service.checkPriority(dto.priority);
  //   return this.projectService.createProject(dto);
  // }

  // @Get('projects')
  // getProjects() {
  //   // TODO: add pagination and sorting
  //   return this.projectService.findManyProjects();
  // }

  @ApiTags('Get single project nodes')
  @Get('projects/:projectId/nodes')
  getRootNodes(@Param('projectId') projectId: string) {
    return this.service.findRootNodes(projectId);
  }

  // nodes from here...
  @ApiTags(
    'Create node which is belong in project, if node has parent then just include it otherwise exclude',
  )
  @Post('nodes')
  createNode(@Body() dto: InfrastructureNodeDto) {
    this.service.checkPriority(dto.priority);
    return this.nodeService.createNode(dto);
  }

  @ApiTags('Get a spasific node childs')
  @Get('nodes/:nodeId/children')
  getChildren(@Param('nodeId') nodeId: string) {
    return this.nodeService.findNodeChildren(nodeId);
  }

  @Patch('nodes/:nodeId')
  updateInfrastructureNode(
    @Param('nodeId') nodeId: string,
    @Body() dto: UpdateInfrastructureNodeDto,
  ) {
    return this.nodeService.updateNode(nodeId, dto);
  }
  @Patch('nodes/:nodeId/progress')
  updateProgress(
    @Param('nodeId') nodeId: string,
    @Body() dto: UpdateInfrastructureNodeDto,
  ) {
    return this.service.updateProgress(nodeId, dto.progress ? dto.progress : 0);
  }
  // @Delete('project/:projectId')
  // deleteProject(@Param('projectId') projectId: string) {
  //   return this.projectService.deleteProject(projectId);
  // }

  @Delete('nodes/:nodeId')
  deleteNode(@Param('nodeId') nodeId: string) {
    return this.nodeService.deleteNode(nodeId);
  }
}

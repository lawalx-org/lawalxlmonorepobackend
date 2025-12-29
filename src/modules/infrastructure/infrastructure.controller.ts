import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
} from './dto/infrastructure.node.dto';
// import { InfrastructureProjectService } from './infrastructure-project/infrastructure-project.service';
import { InfrastructureNodeService } from './infrastructure-node/infrastructure-node.service';
import { InfrastructureService } from './infrastructure.service';

// TODO: Proper error handling from controller
@ApiTags('Infrastructure')
@Controller('infrastructure')
export class InfrastructureController {
  constructor(
    private readonly infrastructureService: InfrastructureService,
    // private readonly projectService: InfrastructureProjectService,
    private readonly nodeService: InfrastructureNodeService,
  ) {}

  /**
   * Get all root nodes for a project
   * GET /infrastructure-nodes/project/:projectId/roots
   */
  @Get('project/:projectId/roots')
  async getRootNodes(@Param('projectId') projectId: string) {
    return this.nodeService.findRootNodes(projectId);
  }

  /**
   * Get full tree structure for a project
   * GET /infrastructure-nodes/project/:projectId/tree
   */
  @Get('project/:projectId/tree')
  async getProjectTree(@Param('projectId') projectId: string) {
    return this.infrastructureService.getProjectTree(projectId);
  }

  /**
   * Get flat list of all nodes in a project
   * GET /infrastructure-nodes/project/:projectId/flat
   */
  @Get('project/:projectId/flat')
  async getProjectNodesFlat(@Param('projectId') projectId: string) {
    return this.infrastructureService.getProjectNodesFlat(projectId);
  }

  /**
   * Get children of a specific node
   * GET /infrastructure-nodes/:nodeId/children
   */
  @Get(':nodeId/children')
  async getNodeChildren(@Param('nodeId') nodeId: string) {
    return this.nodeService.findNodeChildren(nodeId);
  }

  /**
   * Create a new infrastructure node
   * POST /infrastructure-nodes
   */
  @ApiOperation({ summary: 'Create a new node' })
  @Post()
  async createNode(@Body() dto: InfrastructureNodeDto) {
    return this.nodeService.createNode(dto);
  }

  /**
   * Update an existing node
   * PATCH /infrastructure-nodes/:nodeId
   */
  @Patch(':nodeId')
  async updateNode(
    @Param('nodeId') nodeId: string,
    @Body() dto: UpdateInfrastructureNodeDto,
  ) {
    return this.nodeService.updateNode(nodeId, dto);
  }

  /**
   * Delete a node (only leaf nodes)
   * DELETE /infrastructure-nodes/:nodeId
   */
  @Delete(':nodeId')
  async deleteNode(@Param('nodeId') nodeId: string) {
    await this.nodeService.deleteNode(nodeId);
    return { message: 'Node deleted successfully' };
  }
}

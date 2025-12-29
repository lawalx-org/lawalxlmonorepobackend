import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InfrastructureNodeService } from './infrastructure-node/infrastructure-node.service';
import { InfrastructureService } from './infrastructure.service';
import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
} from './dto/infrastructure.node.dto';

@Controller('infrastructure-nodes')
export class InfrastructureNodeController {
  constructor(
    private readonly nodeService: InfrastructureNodeService,
    private readonly infrastructureService: InfrastructureService,
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
   * Get tree structure from a specific node
   * GET /infrastructure-nodes/:nodeId/tree
   */
  @Get(':nodeId/tree')
  async getNodeTree(@Param('nodeId') nodeId: string) {
    return this.infrastructureService.getNodeTree(nodeId);
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

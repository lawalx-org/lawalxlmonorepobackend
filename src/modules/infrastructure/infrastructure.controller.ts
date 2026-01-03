// ============================================================================
// infrastructure-node.controller.ts
// Controller with ONLY routes that match your existing service functions
// ============================================================================

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { InfrastructureNodeService } from './infrastructure-node/infrastructure-node.service';
import { InfrastructureService } from './infrastructure.service';
import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
  BulkNodeImportDto,
  BulkCreateTreeDto,
} from './dto/infrastructure.node.dto';

@ApiTags('Infrastructure Nodes')
@Controller('infrastructure-nodes')
export class InfrastructureNodeController {
  constructor(
    private readonly nodeService: InfrastructureNodeService,
    private readonly infrastructureService: InfrastructureService,
  ) {}

  // =========================================================================
  // BASIC NODE OPERATIONS
  // =========================================================================

  /**
   * Get all root nodes for a project
   * GET /infrastructure-nodes/project/:projectId/roots
   */
  @Get('project/:projectId/roots')
  @ApiOperation({
    summary: 'Get all root nodes for a project',
    description:
      'Returns all nodes with parentId = null for the specified project',
  })
  async getRootNodes(@Param('projectId') projectId: string) {
    return this.nodeService.findRootNodes(projectId);
  }

  /**
   * Get full tree structure for a project WITH CHART DATA
   * GET /infrastructure-nodes/project/:projectId/tree
   */
  @Get('project/:projectId/tree')
  @ApiOperation({
    summary: 'Get full hierarchical tree structure with chart values',
    description:
      'Returns complete tree hierarchy with chartValues for each node',
  })
  async getProjectTree(@Param('projectId') projectId: string) {
    return this.infrastructureService.getProjectTree(projectId);
  }

  /**
   * Get tree structure from a specific node (subtree)
   * GET /infrastructure-nodes/:nodeId/tree
   */
  @Get(':nodeId/tree')
  @ApiOperation({
    summary: 'Get tree structure starting from a specific node',
    description: 'Returns the subtree with the specified node as root',
  })
  async getNodeTree(@Param('nodeId') nodeId: string) {
    return this.infrastructureService.getNodeTree(nodeId);
  }

  /**
   * Get flat list of all nodes in a project
   * GET /infrastructure-nodes/project/:projectId/flat
   */
  @Get('project/:projectId/flat')
  @ApiOperation({
    summary: 'Get flat list of all nodes with hierarchy levels',
    description: 'Returns all nodes in a flat array with their hierarchy level',
  })
  async getProjectNodesFlat(@Param('projectId') projectId: string) {
    return this.infrastructureService.getProjectNodesFlat(projectId);
  }

  /**
   * Get children of a specific node
   * GET /infrastructure-nodes/:nodeId/children
   */
  @Get(':nodeId/children')
  @ApiOperation({
    summary: 'Get direct children of a node',
    description: 'Returns only the immediate children of the specified node',
  })
  async getNodeChildren(@Param('nodeId') nodeId: string) {
    return this.nodeService.findNodeChildren(nodeId);
  }

  /**
   * Create a new infrastructure node
   * POST /infrastructure-nodes
   */
  @Post()
  @ApiOperation({
    summary: 'Create a new node with optional chart values',
    description:
      'Create a new infrastructure node. For leaf nodes, chartValues will calculate progress automatically.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['projectId', 'programId', 'nodeChartId', 'taskName'],
      properties: {
        projectId: { type: 'string', example: 'proj-123' },
        programId: { type: 'string', example: 'prog-456' },
        nodeChartId: { type: 'string', example: 'chart-789' },
        taskName: { type: 'string', example: 'Foundation Work' },
        parentId: { type: 'string', example: 'node-parent-id', nullable: true },
        weight: { type: 'number', example: 1, default: 1 },
        priority: { type: 'string', example: 'HIGH', default: 'NONE' },
        chartValues: {
          type: 'object',
          example: { Sun: 8, Mon: 0, Tue: 3, Wed: 0, Thu: 4, Fri: 0, Sat: 2 },
          nullable: true,
          description: 'Chart column values for leaf nodes',
        },
      },
    },
  })
  async createNode(@Body() dto: InfrastructureNodeDto) {
    return this.nodeService.createNode(dto);
  }

  /**
   * Update an existing node
   * PATCH /infrastructure-nodes/:nodeId
   */
  @Patch(':nodeId')
  @ApiOperation({
    summary: 'Update node properties including chart values',
    description:
      'Update node data. For leaf nodes, updating chartValues will recalculate progress and propagate up.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        taskName: { type: 'string', example: 'Updated Task Name' },
        weight: { type: 'number', example: 2 },
        priority: { type: 'string', example: 'HIGH' },
        chartValues: {
          type: 'object',
          example: { Sun: 10, Mon: 5, Tue: 8, Wed: 3, Thu: 7, Fri: 2, Sat: 4 },
          description: 'Only for LEAF nodes',
        },
        duration: { type: 'number', example: 10 },
        actualHour: { type: 'number', example: 15.5 },
        plannedHour: { type: 'number', example: 20 },
        plannedCost: { type: 'number', example: 5000 },
        plannedResourceCost: { type: 'number', example: 3000 },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Delete a leaf node',
    description:
      'Delete a node (only leaf nodes can be deleted). Progress propagates up after deletion.',
  })
  async deleteNode(@Param('nodeId') nodeId: string) {
    await this.nodeService.deleteNode(nodeId);
    return {
      success: true,
      message: 'Node deleted successfully',
    };
  }

  // =========================================================================
  // BULK OPERATIONS (NEW - CHART VALUES)
  // =========================================================================

  /**
   * *** NEW: Bulk import chart values for multiple nodes (JSON) ***
   * POST /infrastructure-nodes/project/:projectId/bulk-import-values
   *
   * THIS IS YOUR MAIN ENDPOINT FOR IMPORTING CHART DATA VIA JSON!
   */
  @Post('project/:projectId/bulk-import-values')
  @ApiOperation({
    summary: '🔥 Bulk import chart values for multiple leaf nodes (JSON)',
    description: `Import chart values for multiple leaf nodes at once.
    
    **This is your main endpoint for updating chart data via JSON!**
    
    Process:
    1. Send array of nodes with their chartValues
    2. System validates each node is a leaf
    3. Updates chartValues and calculates progress
    4. Propagates changes up to all ancestors
    5. Updates project-level progress
    
    Only LEAF nodes can be updated. Parent nodes will auto-calculate.`,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['projectId', 'nodes'],
      properties: {
        projectId: { type: 'string', example: 'proj-123' },
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            required: ['nodeId', 'chartValues'],
            properties: {
              nodeId: { type: 'string', example: 'node-abc-123' },
              chartValues: {
                type: 'object',
                example: {
                  Sun: 8,
                  Mon: 0,
                  Tue: 3,
                  Wed: 0,
                  Thu: 4,
                  Fri: 0,
                  Sat: 2,
                },
              },
            },
          },
          example: [
            {
              nodeId: 'node-abc-123',
              chartValues: {
                Sun: 8,
                Mon: 0,
                Tue: 3,
                Wed: 0,
                Thu: 4,
                Fri: 0,
                Sat: 2,
              },
            },
            {
              nodeId: 'node-def-456',
              chartValues: {
                Sun: 6,
                Mon: 0,
                Tue: 11,
                Wed: 0,
                Thu: 4,
                Fri: 0,
                Sat: 4,
              },
            },
          ],
        },
      },
    },
  })
  async bulkImportChartValues(
    @Param('projectId') projectId: string,
    @Body() dto: BulkNodeImportDto,
  ) {
    return this.nodeService.bulkImportChartValues(dto);
  }

  /**
   * *** NEW: Bulk create entire tree structure ***
   * POST /infrastructure-nodes/project/:projectId/bulk-create-tree
   */
  @Post('project/:projectId/bulk-create-tree')
  @ApiOperation({
    summary: 'Bulk create entire tree hierarchy structure',
    description: `Create complete node hierarchy in one request.
    
    Use this to set up initial project structure with multi-level hierarchies.
    Chart values can be added later via bulk-import-values endpoint.`,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['projectId', 'programId', 'chartId', 'nodes'],
      properties: {
        projectId: { type: 'string', example: 'proj-123' },
        programId: { type: 'string', example: 'prog-456' },
        chartId: { type: 'string', example: 'chart-789' },
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            required: ['taskName'],
            properties: {
              taskName: { type: 'string', example: 'Phase 1' },
              weight: { type: 'number', example: 1, default: 1 },
              priority: { type: 'string', example: 'HIGH', default: 'NONE' },
              children: {
                type: 'array',
                items: { type: 'object' },
                description: 'Nested children (same structure)',
              },
            },
          },
          example: [
            {
              taskName: 'Foundation Work',
              weight: 1,
              children: [
                {
                  taskName: 'Excavation',
                  weight: 1,
                  children: [],
                },
                {
                  taskName: 'Concrete Pouring',
                  weight: 1,
                  children: [],
                },
              ],
            },
          ],
        },
      },
    },
  })
  async bulkCreateTree(
    @Param('projectId') projectId: string,
    @Body() dto: BulkCreateTreeDto,
  ) {
    return this.nodeService.bulkCreateTree(dto);
  }
}

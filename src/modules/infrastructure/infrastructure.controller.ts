import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InfrastructureNodeService } from './infrastructure-node/infrastructure-node.service';
import { InfrastructureService } from './infrastructure.service';
import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
} from './dto/infrastructure.node.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { InfrastructureExcelService } from './plugins/InfrastructureExcelService';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags("Infrastructure Nodes")
@Controller('infrastructure-nodes')
export class InfrastructureNodeController {
  constructor(
    private readonly nodeService: InfrastructureNodeService,
    private readonly infrastructureService: InfrastructureService,
    private readonly infrastructureExcelService: InfrastructureExcelService,
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
  /**
   * Export a project and all its nodes to Excel format
   * GET /infrastructure-nodes/project/:projectId/export
   */
  // @ApiTags('Export')
  @Get('project/:projectId/export')
  async exportProjectToExcel(
    @Param('projectId') projectId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const buffer =
      await this.infrastructureExcelService.exportProjectToExcel(projectId);

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `project-${projectId}-${timestamp}.xlsx`;

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });

    return new StreamableFile(buffer);
  }
  /**
   * Import Excel file and update node data
   * POST /infrastructure-nodes/project/:projectId/import
   */
  // @ApiTags('Import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('project/:projectId/import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcelToProject(
    @Param('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];

    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Please upload an Excel file (.xlsx or .xls)',
      );
    }

    return this.infrastructureExcelService.importExcelToProject(
      projectId,
      file.buffer,
    );
  }
}

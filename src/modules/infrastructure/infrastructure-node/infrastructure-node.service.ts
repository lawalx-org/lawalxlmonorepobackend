import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureNodeRepository } from './infrastructure-node.repository';
import { InfrastructureRepository } from '../infrastructure.repository';
import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
  BulkNodeImportDto,
  BulkCreateTreeDto,
  TreeNodeDto,
} from '../dto/infrastructure.node.dto';

@Injectable()
export class InfrastructureNodeService {
  constructor(
    private readonly infrastructureService: InfrastructureService,
    private readonly nodeRepo: InfrastructureNodeRepository,
    private readonly infrastructureRepo: InfrastructureRepository,
  ) {}

  /**
   * Generate a unique slug from taskName
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Calculate computedProgress from chartValues
   * Formula: SUM(all values) / COUNT(columns)
   * Example: { "Sun": 8, "Mon": 0, "Tue": 3 } => (8 + 0 + 3) / 3 = 3.67
   */
  private calculateProgressFromChartValues(
    chartValues: Record<string, number> | null,
  ): number {
    if (!chartValues || Object.keys(chartValues).length === 0) {
      return 0;
    }

    const values = Object.values(chartValues);
    const sum = values.reduce((acc, val) => acc + (val || 0), 0);
    const count = values.length;

    return count > 0 ? sum / count : 0;
  }

  /**
   * Find all root nodes for a project
   */
  async findRootNodes(projectId: string) {
    return this.nodeRepo.findRootNodes(projectId);
  }

  /**
   * Create a new infrastructure node with chart values
   */
  async createNode(dto: InfrastructureNodeDto) {
    if (!dto.projectId || !dto.programId || !dto.nodeChartId || !dto.taskName) {
      throw new BadRequestException(
        'Missing required fields: projectId, programId, nodeChartId or taskName',
      );
    }

    // Validate program exists
    const program = await this.infrastructureRepo.findProgramById(
      dto.programId,
    );
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Validate project exists
    const project = await this.infrastructureRepo.findProjectById(
      dto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Validate that the chart exists
    const chart = await this.nodeRepo.findNodeChartById(dto.nodeChartId);
    if (!chart) {
      throw new NotFoundException(`Chart with id ${dto.nodeChartId} not found`);
    }

    // *** Validate chart is in project's chartList ***
    if (project.chartList && !project.chartList.includes(dto.nodeChartId)) {
      throw new BadRequestException(
        `Chart ${dto.nodeChartId} is not in project's chart list`,
      );
    }

    // Generate unique slug
    const baseSlug = this.slugify(dto.taskName);
    let slug = baseSlug;
    let counter = 1;
    while (await this.infrastructureRepo.findNodeBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Validate parent (if provided)
    let parentNode: any = null;
    if (dto.parentId) {
      parentNode = await this.infrastructureRepo.findNodeById(dto.parentId);
      if (!parentNode) {
        throw new NotFoundException('Parent node not found');
      }
      if (parentNode.projectId !== dto.projectId) {
        throw new ConflictException(
          'Parent node belongs to a different project',
        );
      }

      // Parent is no longer a leaf
      if (parentNode.isLeaf) {
        await this.nodeRepo.updateNode(parentNode.id, {
          isLeaf: false,
          progress: null,
          chartValues: {}, // Parent will have calculated values
        });
      }
    }

    // *** Calculate initial computedProgress from chartValues ***
    const initialProgress = dto.chartValues
      ? this.calculateProgressFromChartValues(dto.chartValues)
      : 0;

    // Create the node with chart values
    const createdNode = await this.nodeRepo.createNode({
      taskName: dto.taskName,
      slug,
      weight: dto.weight ?? 1,
      priority: dto.priority ?? 'NONE',
      progress: dto.chartValues ? initialProgress : 0,
      computedProgress: initialProgress,
      isLeaf: true,
      programId: program.id,
      chartValues: dto.chartValues || {}, // Store chart values

      // Relations
      project: { connect: { id: dto.projectId } },
      parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
      nodeChart: { connect: { id: dto.nodeChartId } },
    });

    // Propagate progress and chart values up the tree
    if (dto.parentId) {
      await this.infrastructureService.propagateUpWithCharts(dto.parentId);
    } else {
      await this.infrastructureService.updateProjectProgress(dto.projectId);
    }

    return createdNode;
  }

  /**
   * Update an existing node with chart values
   */
  async updateNode(nodeId: string, dto: UpdateInfrastructureNodeDto) {
    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (!node) {
      throw new NotFoundException('Node not found');
    }

    const { parentId, progress, chartValues, ...rest } = dto;

    // Prevent self-parent
    if (parentId && parentId === nodeId) {
      throw new ConflictException('Node cannot be its own parent');
    }

    // Prevent circular ancestry
    if (parentId) {
      let currentParentId = parentId;
      while (currentParentId) {
        if (currentParentId === nodeId) {
          throw new ConflictException('Circular parent reference detected');
        }
        const parent =
          await this.infrastructureRepo.findNodeById(currentParentId);
        if (!parent) break;
        currentParentId = parent.parentId!;
      }
    }

    // Prevent parent changes
    if (parentId !== undefined && parentId !== node.parentId) {
      throw new ConflictException("You can't change the parent ID of any leaf");
    }

    // *** Update chartValues and calculate progress for LEAF nodes only ***
    if (chartValues !== undefined) {
      if (!node.isLeaf) {
        throw new ConflictException(
          'Cannot set chart values on non-leaf nodes. Values are auto-calculated from children.',
        );
      }

      // Calculate new progress from chart values
      const newProgress = this.calculateProgressFromChartValues(chartValues);

      await this.nodeRepo.updateNode(nodeId, {
        ...rest,
        chartValues,
        progress: newProgress,
        computedProgress: newProgress,
      });

      // Propagate changes up the tree
      await this.infrastructureService.propagateUpWithCharts(node.parentId);
      await this.infrastructureService.updateProjectProgress(node.projectId);
    } else if (progress !== undefined) {
      // Legacy: Manual progress update (if still needed)
      if (!node.isLeaf) {
        throw new ConflictException('Cannot set progress on non-leaf nodes');
      }

      await this.nodeRepo.updateNode(nodeId, {
        ...rest,
        progress,
        computedProgress: progress ?? 0,
      });

      await this.infrastructureService.propagateUpWithCharts(node.parentId);
      await this.infrastructureService.updateProjectProgress(node.projectId);
    } else {
      // Regular update without progress/chart changes
      await this.nodeRepo.updateNode(nodeId, rest);
    }

    return this.infrastructureRepo.findNodeById(nodeId);
  }

  /**
   * Bulk import chart values for multiple nodes (JSON import)
   * This is what you'll use when user submits the hierarchical JSON data
   */
  async bulkImportChartValues(dto: BulkNodeImportDto) {
    const project = await this.infrastructureRepo.findProjectById(
      dto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const results: any[] = [];
    const errors: string[] = [];

    // Update each node's chart values
    for (const nodeData of dto.nodes) {
      try {
        const node = await this.infrastructureRepo.findNodeById(
          nodeData.nodeId,
        );

        if (!node) {
          errors.push(`Node ${nodeData.nodeId} not found`);
          continue;
        }

        if (!node.isLeaf) {
          errors.push(
            `Node ${node.taskName} is not a leaf node. Only leaf nodes can have chart values imported.`,
          );
          continue;
        }

        if (node.projectId !== dto.projectId) {
          errors.push(`Node ${node.taskName} does not belong to this project`);
          continue;
        }

        // Calculate progress from chart values
        const newProgress = this.calculateProgressFromChartValues(
          nodeData.chartValues,
        );

        // Update node with new chart values
        await this.nodeRepo.updateNode(nodeData.nodeId, {
          chartValues: nodeData.chartValues,
          progress: newProgress,
          computedProgress: newProgress,
        });

        results.push({
          nodeId: nodeData.nodeId,
          taskName: node.taskName,
          chartValues: nodeData.chartValues,
          computedProgress: newProgress,
          status: 'success',
        });

        // Propagate up
        await this.infrastructureService.propagateUpWithCharts(node.parentId);
      } catch (error) {
        errors.push(`Error updating node ${nodeData.nodeId}: ${error.message}`);
      }
    }

    // Update project progress after all updates
    await this.infrastructureService.updateProjectProgress(dto.projectId);

    return {
      success: errors.length === 0,
      updated: results.length,
      results,
      errors,
    };
  }

  /**
   * Bulk create entire tree structure at once
   * Use this for creating the initial hierarchy
   */
  async bulkCreateTree(dto: BulkCreateTreeDto) {
    const project = await this.infrastructureRepo.findProjectById(
      dto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const program = await this.infrastructureRepo.findProgramById(
      dto.programId,
    );
    if (!program) {
      throw new NotFoundException('Program not found');
    }

    const chart = await this.nodeRepo.findNodeChartById(dto.chartId);
    if (!chart) {
      throw new NotFoundException(`Chart ${dto.chartId} not found`);
    }

    // *** Validate chart is in project's chartList ***
    if (project.chartList && !project.chartList.includes(dto.chartId)) {
      throw new BadRequestException(
        `Chart ${dto.chartId} is not in project's chart list`,
      );
    }

    // Recursive function to create nodes
    const createNodeRecursive = async (
      nodeDto: TreeNodeDto,
      parentId: string | null,
    ): Promise<any> => {
      // Generate unique slug
      const baseSlug = this.slugify(nodeDto.taskName);
      let slug = baseSlug;
      let counter = 1;
      while (await this.infrastructureRepo.findNodeBySlug(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Determine if this is a leaf node (has no children)
      const isLeaf = !nodeDto.children || nodeDto.children.length === 0;

      // Create the node
      const createdNode = await this.nodeRepo.createNode({
        taskName: nodeDto.taskName,
        slug,
        weight: nodeDto.weight ?? 1,
        priority: nodeDto.priority ?? 'NONE',
        progress: 0,
        computedProgress: 0,
        isLeaf,
        programId: dto.programId,
        chartValues: {}, // Empty initially, will be filled during import

        project: { connect: { id: dto.projectId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
        nodeChart: { connect: { id: dto.chartId } },
      });

      // Recursively create children
      if (nodeDto.children && nodeDto.children.length > 0) {
        for (const childDto of nodeDto.children) {
          await createNodeRecursive(childDto, createdNode.id);
        }
      }

      return createdNode;
    };

    // Create all root nodes and their children
    const createdNodes: any[] = [];
    for (const nodeDto of dto.nodes) {
      const created = await createNodeRecursive(nodeDto, null);
      createdNodes.push(created);
    }

    return {
      success: true,
      message: `Created ${createdNodes.length} root nodes with their hierarchies`,
      nodes: createdNodes,
    };
  }

  /**
   * Get children of a specific node
   */
  async findNodeChildren(parentNodeId: string) {
    const node = await this.infrastructureRepo.findNodeById(parentNodeId);
    if (!node) {
      throw new NotFoundException('Node not found');
    }

    return this.nodeRepo.findChildren(parentNodeId);
  }

  /**
   * Delete a node (only leaf nodes)
   */
  async deleteNode(nodeId: string) {
    const node = await this.infrastructureRepo.findNodeById(nodeId);

    if (!node) {
      throw new NotFoundException('Node not found');
    }

    if (!node.isLeaf) {
      throw new ConflictException('Cannot delete non-leaf node');
    }

    const parentId = node.parentId;
    const projectId = node.projectId;

    // Delete the node
    await this.nodeRepo.deleteNode(nodeId);

    // Check if parent should become a leaf again
    if (parentId) {
      const remainingChildren = await this.nodeRepo.countChildren(parentId);

      if (remainingChildren === 0) {
        await this.nodeRepo.updateNode(parentId, {
          isLeaf: true,
          progress: 0,
          computedProgress: 0,
          chartValues: {}, // Empty chart values for new leaf
        });
      }
    }

    // Propagate progress changes
    await this.infrastructureService.propagateUpWithCharts(parentId);
    await this.infrastructureService.updateProjectProgress(projectId);
  }
}

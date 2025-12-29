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
   * Find all root nodes for a project
   */
  async findRootNodes(projectId: string) {
    return this.nodeRepo.findRootNodes(projectId);
  }

  /**
   * Create a new infrastructure node
   */
  async createNode(dto: InfrastructureNodeDto) {
    if (!dto.projectId || !dto.taskName) {
      throw new BadRequestException('Invalid node payload');
    }

    // Generate unique slug
    const baseSlug = this.slugify(dto.taskName);
    let slug = baseSlug;
    let counter = 1;

    while (await this.infrastructureRepo.findNodeBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Validate project exists
    const project = await this.infrastructureRepo.findProjectById(
      dto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Validate parent (if exists)
    if (dto.parentId) {
      const parent = await this.infrastructureRepo.findNodeById(dto.parentId);
      if (!parent) {
        throw new NotFoundException('Parent node not found');
      }

      if (parent.projectId !== dto.projectId) {
        throw new ConflictException('Parent belongs to another project');
      }

      // Parent becomes non-leaf
      if (parent.isLeaf) {
        await this.nodeRepo.updateNode(parent.id, {
          isLeaf: false,
          progress: null,
        });
      }
    }

    // Create the node
    const { projectId, parentId, ...rest } = dto;

    const node = await this.nodeRepo.createNode({
      ...rest,
      slug,
      project: {
        connect: { id: projectId },
      },
      parent: parentId ? { connect: { id: parentId } } : undefined,
      isLeaf: true,
      progress: 0,
      computedProgress: 0,
      weight: dto.weight || 1,
    });

    // Propagate progress changes
    await this.infrastructureService.propagateUp(dto.parentId);
    await this.infrastructureService.updateProjectProgress(dto.projectId);

    return node;
  }

  /**
   * Update an existing node
   */
  async updateNode(nodeId: string, dto: UpdateInfrastructureNodeDto) {
    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (!node) {
      throw new NotFoundException('Node not found');
    }

    const { parentId, progress, ...rest } = dto;

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

    // Update progress for leaf nodes only
    if (progress !== undefined) {
      if (!node.isLeaf) {
        throw new ConflictException('Cannot set progress on non-leaf nodes');
      }

      // Update both progress and computedProgress for leaf nodes
      await this.nodeRepo.updateNode(nodeId, {
        ...rest,
        progress,
        computedProgress: progress ?? 0,
      });

      // Propagate changes up the tree
      await this.infrastructureService.propagateUp(node.parentId);
      await this.infrastructureService.updateProjectProgress(node.projectId);
    } else {
      // Regular update without progress change
      await this.nodeRepo.updateNode(nodeId, rest);
    }

    return this.infrastructureRepo.findNodeById(nodeId);
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
        });
      }
    }

    // Propagate progress changes
    await this.infrastructureService.propagateUp(parentId);
    await this.infrastructureService.updateProjectProgress(projectId);
  }
}

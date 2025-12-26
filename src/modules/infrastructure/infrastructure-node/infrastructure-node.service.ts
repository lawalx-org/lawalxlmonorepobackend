import {
  InfrastructureNodeDto,
  UpdateInfrastructureNodeDto,
} from '../dto/infrastructure.node.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InfrastructureNodeRepository } from './infrastructure-node.repository';
import { slugify } from '../functions';
import { InfrastructureRepository } from '../infrastructure.repository';
import { InfrastructureService } from '../infrastructure.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class InfrastructureNodeService {
  constructor(
    private readonly infrastructureService: InfrastructureService,
    private readonly nodeRepo: InfrastructureNodeRepository,
    private readonly infrastructureRepo: InfrastructureRepository,
  ) {}

  async findRootNodes(projectId: string) {
    return this.nodeRepo.findRootNodes(projectId);
  }

  async createNode(dto: InfrastructureNodeDto) {
    if (!dto.projectId || !dto.taskName)
      throw new BadRequestException('Invalid node payload');

    const slug = slugify(dto.taskName);
    if (await this.infrastructureRepo.findNodeBySlug(slug)) {
      throw new ConflictException('Project slug already exists');
    }

    const project = await this.infrastructureRepo.findProjectById(
      dto.projectId,
    );
    if (!project) throw new NotFoundException('Project not found');

    // Validate parent (if exists)
    if (dto.parentId) {
      const parent = await this.infrastructureRepo.findNodeById(dto.parentId);
      if (!parent) throw new NotFoundException('Parent node not found');

      if (parent.projectId !== dto.projectId) {
        throw new ConflictException('Parent belongs to another project');
      }

      // Parent becomes non-leaf
      if (parent.isLeaf) {
        await this.nodeRepo.updateNode(parent.id, {
          ...dto,
          isLeaf: false,
          progress: null,
        });
      }
    }

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
    });

    await this.infrastructureService.propagateUp(dto.parentId);
    await this.infrastructureService.updateProjectProgress(dto.projectId);

    return node;
  }

  async updateNode(nodeId: string, dto: UpdateInfrastructureNodeDto) {
    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (!node) throw new NotFoundException('Node not found');
    // Only Leaf progress will get update
    if (dto.progress && !node.isLeaf)
      throw new ConflictException('Only leaf nodes can have progress');

    const { parentId, progress, ...rest } = dto;
    const data: Prisma.InfrastructureNodeUpdateInput = {
      ...rest,
    };
    if (progress) {
      data.progress = progress;
      data.computedProgress = progress;
    }
    if (parentId !== node.parentId) {
      throw new ConflictException("You can't change the parent ID of any leaf");
      /**
       * @features plan
       */
      // data.parent = parentId
      //   ? { connect: { id: parentId } }
      //   : { disconnect: true };
    }

    const updated = await this.nodeRepo.updateNode(nodeId, data);

    if (progress) {
      await this.infrastructureService.propagateUp(node.parentId);
      await this.infrastructureService.updateProjectProgress(node.projectId);
    }

    return updated;
  }

  async findNodeChildren(parentNodeId: string) {
    return await this.nodeRepo.findChildren(parentNodeId);
  }

  async deleteNode(nodeId: string) {
    const node = await this.infrastructureRepo.findNodeById(nodeId);

    if (!node) throw new NotFoundException('Node not found');
    if (!node.isLeaf) {
      throw new ConflictException('Cannot delete non-leaf node');
    }

    const parentId = node.parentId;
    const projectId = node.projectId;

    await this.nodeRepo.deleteNode(nodeId);

    // Parent may become leaf again
    if (parentId && (await this.nodeRepo.countChildren(parentId)) === 0) {
      await this.nodeRepo.updateNode(parentId, {
        isLeaf: true,
        progress: 0,
        computedProgress: 0,
      });
    }

    await this.infrastructureService.propagateUp(parentId);
    await this.infrastructureService.updateProjectProgress(projectId);
  }
}

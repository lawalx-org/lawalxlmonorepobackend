import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureDto } from './dto/infrastructure.dto';
import { slugify } from './functions';
import { InfrastructureNodeDto } from './dto/infrastructure.node.dto';

@Injectable()
export class InfrastructureService {
  constructor(private readonly repo: InfrastructureRepository) {}

  async createProject(project: InfrastructureDto) {
    if (!project.name)
      throw new BadRequestException('Project name is required');
    // TODO: create slug from name
    const projectSlug = slugify(project.name);
    // TODO: check if slug already exists
    const existingProject = await this.repo.findBySlug(projectSlug);
    if (existingProject)
      throw new ConflictException('Project with this slug already exists');

    return await this.repo.createProject({
      ...project,
      slug: projectSlug,
    });
  }

  async addChild(projectId: string, child: InfrastructureNodeDto) {
    const project = await this.repo.findProjectById(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const parent = await this.repo.findById();
    if (!parent) throw new Error('Parent not found');

    // Parent becomes non-leaf
    if (child.isLeaf) {
      await this.repo.update(parent.id, {
        isLeaf: false,
        progress: null,
      });
    }

    const node = await this.repo.create({
      ...child,
      parent: { connect: { id: parentId } },
      infrastructureProject: {
        connect: { id: parent.infrastructureProjectId },
      },
      isLeaf: true,
      progress: 0,
      computedProgress: 0,
    });

    await this.propagateProgressUp(parentId);

    return node;
  }
  async updateProgress(nodeId: string, progress: number) {
    const node = await this.repo.findById(nodeId);

    if (!node) throw new NotFoundException('Node not found');
    if (!node.isLeaf)
      throw new ConflictException('Only leaf nodes can be updated');

    await this.repo.update(nodeId, {
      progress,
      computedProgress: progress,
    });

    await this.propagateProgressUp(node.parentId);
  }
  async deleteNode(nodeId: string) {
    const node = await this.repo.findById(nodeId);

    if (!node) throw new Error('Node not found');
    if (!node.isLeaf) throw new Error('Cannot delete non-leaf node');

    const parentId = node.parentId;
    await this.repo.delete(nodeId);

    if (parentId) {
      const count = await this.repo.countChildren(parentId);

      if (count === 0) {
        // Parent becomes leaf again
        await this.repo.update(parentId, {
          isLeaf: true,
          progress: 0,
          computedProgress: 0,
        });
      }

      await this.propagateProgressUp(parentId);
    }
  }

  private async propagateProgressUp(nodeId?: string | null) {
    if (!nodeId) return;

    const children = await this.repo.findChildren(nodeId);
    if (children.length === 0) return;

    const totalWeight = children.reduce((s, c) => s + c.weight, 0);
    const computed =
      children.reduce((s, c) => s + c.computedProgress * c.weight, 0) /
      totalWeight;

    const node = await this.repo.findById(nodeId);

    if (!node) throw new NotFoundException('No not found!');
    if (node.computedProgress !== computed) {
      await this.repo.update(nodeId, { computedProgress: computed });
      await this.propagateProgressUp(node.parentId);
    }
  }
}

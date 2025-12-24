import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';
import { slugify } from './functions';
import { InfrastructureNodeDto } from './dto/infrastructure.node.dto';
import { InfrastructureProjectDto } from './dto/infrastructure.dto';

@Injectable()
export class InfrastructureService {
  constructor(private readonly repo: InfrastructureRepository) {}

  // project
  async createProject(dto: InfrastructureProjectDto) {
    if (!dto.taskName)
      throw new BadRequestException('Project name is required');

    const slug = slugify(dto.taskName);
    if (await this.repo.findBySlug(slug)) {
      throw new ConflictException('Project slug already exists');
    }

    return this.repo.createProject({
      ...dto,
      taskName: dto.taskName,
      slug,
    });
  }
  async findManyProjects() {
    const projects = await this.repo.findManyProjects();

    return projects.map((project) => {
      const tree = this.buildTree(project.nodes);

      return {
        ...project,
        nodes: tree,
      };
    });
  }

  async findRootNodes(projectId: string) {
    return this.repo.findRootNodes(projectId);
  }

  async createNode(dto: InfrastructureNodeDto) {
    if (!dto.infrastructureProjectId || !dto.taskName)
      throw new BadRequestException('Invalid node payload');

    const slug = slugify(dto.taskName);
    if (await this.repo.findBySlug(slug)) {
      throw new ConflictException('Project slug already exists');
    }

    const project = await this.repo.findProjectById(
      dto.infrastructureProjectId,
    );
    if (!project) throw new NotFoundException('Project not found');

    // Validate parent (if exists)
    if (dto.parentId) {
      const parent = await this.repo.findNodeById(dto.parentId);
      if (!parent) throw new NotFoundException('Parent node not found');

      if (parent.infrastructureProjectId !== dto.infrastructureProjectId) {
        throw new ConflictException('Parent belongs to another project');
      }

      // Parent becomes non-leaf
      if (parent.isLeaf) {
        await this.repo.updateNode(parent.id, {
          ...dto,
          isLeaf: false,
          progress: null,
        });
      }
    }

    const node = await this.repo.createNode({
      ...dto,
      taskName: dto.taskName,
      slug,
      infrastructureProject: { connect: { id: dto.infrastructureProjectId } },
      parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
      isLeaf: true,
      progress: 0,
      computedProgress: 0,
    });

    await this.propagateUp(dto.parentId);
    await this.updateProjectProgress(dto.infrastructureProjectId);

    return node;
  }

  async findChildren(nodeId: string) {
    return this.repo.findChildren(nodeId);
  }

  async updateProgress(nodeId: string, progress: number) {
    const node = await this.repo.findNodeById(nodeId);

    if (!node) throw new NotFoundException('Node not found');
    if (!node.isLeaf) {
      throw new ConflictException('Only leaf nodes can be updated');
    }

    await this.repo.updateNode(nodeId, {
      progress,
      computedProgress: progress,
    });

    await this.propagateUp(node.parentId);
    await this.updateProjectProgress(node.infrastructureProjectId);
  }

  async deleteNode(nodeId: string) {
    const node = await this.repo.findNodeById(nodeId);

    if (!node) throw new NotFoundException('Node not found');
    if (!node.isLeaf) {
      throw new ConflictException('Cannot delete non-leaf node');
    }

    const parentId = node.parentId;
    const projectId = node.infrastructureProjectId;

    await this.repo.deleteNode(nodeId);

    // Parent may become leaf again
    if (parentId && (await this.repo.countChildren(parentId)) === 0) {
      await this.repo.updateNode(parentId, {
        isLeaf: true,
        progress: 0,
        computedProgress: 0,
      });
    }

    await this.propagateUp(parentId);
    await this.updateProjectProgress(projectId);
  }

  // private
  private async propagateUp(nodeId?: string | null) {
    if (!nodeId) return;

    const children = await this.repo.findChildren(nodeId);
    if (children.length === 0) return;

    const totalWeight = children.reduce((s, c) => s + c.weight, 0);
    const computed =
      children.reduce((s, c) => s + c.computedProgress * c.weight, 0) /
      totalWeight;

    const node = await this.repo.findNodeById(nodeId);
    if (!node) return;

    if (node.computedProgress !== computed) {
      await this.repo.updateNode(nodeId, { computedProgress: computed });
      await this.propagateUp(node.parentId);
    }
  }

  private async updateProjectProgress(projectId: string) {
    const roots = await this.repo.findRootNodes(projectId);
    if (roots.length === 0) return;

    const avg =
      roots.reduce((s, n) => s + n.computedProgress, 0) / roots.length;

    await this.repo.updateProject(projectId, { computedProgress: avg });
  }

  private buildTree(nodes: any[], parentId: string | null = null) {
    return nodes
      .filter((node) => node.parentId === parentId)
      .map((node) => ({
        ...node,
        children: this.buildTree(nodes, node.id),
      }));
  }
}

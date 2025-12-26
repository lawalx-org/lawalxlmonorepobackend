import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureNodeRepository } from './infrastructure-node/infrastructure-node.repository';
import { priority, Priority } from './contants';
import { InfrastructureProjectRepository } from './infrastructure-project/infrastructure-project.repository';

@Injectable()
export class InfrastructureService {
  constructor(
    private readonly repo: InfrastructureRepository,
    private readonly nodeRepo: InfrastructureNodeRepository,
    private readonly projectRepo: InfrastructureProjectRepository,
  ) {}

  async findRootNodes(projectId: string) {
    return this.nodeRepo.findRootNodes(projectId);
  }

  async updateProgress(nodeId: string, progress: number) {
    const node = await this.repo.findNodeById(nodeId);

    if (!node) throw new NotFoundException('Node not found');
    if (!node.isLeaf) {
      throw new ConflictException('Only leaf nodes can be updated');
    }

    await this.nodeRepo.updateNode(nodeId, {
      progress,
      computedProgress: progress,
    });

    await this.propagateUp(node.parentId);
    await this.updateProjectProgress(node.projectId);
  }

  // private
  async propagateUp(nodeId?: string | null) {
    if (!nodeId) return;

    const children = await this.nodeRepo.findChildren(nodeId);
    if (children.length === 0) return;

    const totalWeight = children.reduce((s, c) => s + c.weight, 0);
    const computed =
      children.reduce((s, c) => s + c.computedProgress * c.weight, 0) /
      totalWeight;

    const node = await this.repo.findNodeById(nodeId);
    if (!node) return;

    if (node.computedProgress !== computed) {
      await this.nodeRepo.updateNode(nodeId, { computedProgress: computed });
      await this.propagateUp(node.parentId);
    }
  }

  async updateProjectProgress(projectId: string) {
    const roots = await this.nodeRepo.findRootNodes(projectId);
    if (roots.length === 0) return;

    const avg =
      roots.reduce((s, n) => s + n.computedProgress, 0) / roots.length;

    await this.projectRepo.updateProject(projectId, { computedProgress: avg });
  }

  buildTree(nodes: any[], parentId: string | null = null) {
    return nodes
      .filter((node) => node.parentId === parentId)
      .map((node) => ({
        ...node,
        children: this.buildTree(nodes, node.id),
      }));
  }
  /**
   * @deprecated
   */
  buildNestedTree(nodes: any[]) {
    const nodeMap = new Map<string, any>();
    const roots: any[] = [];

    // Initialize map
    for (const node of nodes) {
      nodeMap.set(node.id, { ...node, children: [] });
    }

    // Build tree
    for (const node of nodes) {
      //  Prevent self reference
      if (node.parentId && node.parentId === node.id) {
        continue;
      }

      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId).children.push(nodeMap.get(node.id));
      } else {
        // Root node
        roots.push(nodeMap.get(node.id));
      }
    }

    return roots;
  }

  checkPriority(p: Priority) {
    if (!priority.includes(p)) {
      throw new BadRequestException(
        `Priority must match with any of those [${priority}]`,
      );
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureNodeRepository } from './infrastructure-node/infrastructure-node.repository';
import { InfrastructureProjectRepository } from './infrastructure-project/infrastructure-project.repository';
import { InfrastructureNodeDto } from './dto/infrastructure.node.dto';
import { Prisma } from 'generated/prisma';
import { priority, Priority } from './contants';

@Injectable()
export class InfrastructureService {
  constructor(
    private readonly infrastructureRepo: InfrastructureRepository,
    private readonly nodeRepo: InfrastructureNodeRepository,
    private readonly projectRepo: InfrastructureProjectRepository,
  ) {}

  /**
   * Recursively propagate progress upward from a given node to its ancestors
   */
  async propagateUp(
    nodeId?: string | null,
    visited = new Set<string>(),
  ): Promise<void> {
    if (!nodeId) return;

    // 🔒 Break circular references
    if (visited.has(nodeId)) {
      console.error('Circular reference detected at node:', nodeId);
      return;
    }
    visited.add(nodeId);

    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (!node) return;

    const children = await this.nodeRepo.findChildren(nodeId);
    if (children.length === 0) return;

    const totalWeight = children.reduce((sum, c) => sum + (c.weight ?? 0), 0);

    if (totalWeight === 0) {
      await this.nodeRepo.updateNode(nodeId, { computedProgress: 0 });
      return;
    }

    const weightedSum = children.reduce(
      (sum, c) => sum + (c.computedProgress ?? 0) * (c.weight ?? 0),
      0,
    );

    await this.nodeRepo.updateNode(nodeId, {
      computedProgress: weightedSum / totalWeight,
    });

    if (!node.parentId) return;

    await this.propagateUp(node.parentId, visited);
  }

  /**
   * Update project's overall progress based on root nodes
   */
  async updateProjectProgress(projectId: string): Promise<void> {
    const rootNodes = await this.nodeRepo.findRootNodes(projectId);

    if (rootNodes.length === 0) {
      await this.nodeRepo.updateProjectProgress(projectId, 0);
      return;
    }

    const totalWeight = rootNodes.reduce((sum, node) => sum + node.weight, 0);

    if (totalWeight === 0) {
      await this.nodeRepo.updateProjectProgress(projectId, 0);
      return;
    }

    const weightedSum = rootNodes.reduce(
      (sum, node) => sum + node.computedProgress * node.weight,
      0,
    );

    const projectProgress = weightedSum / totalWeight;

    await this.nodeRepo.updateProjectProgress(
      projectId,
      Math.round(projectProgress * 100) / 100, // Round to 2 decimal places
    );
  }

  /**
   * Build a tree structure from a root node
   */
  async buildTree(node: any): Promise<any> {
    const children = await this.nodeRepo.findChildren(node.id);

    const childTrees = await Promise.all(
      children.map((child) => this.buildTree(child)),
    );

    return {
      id: node.id,
      taskName: node.taskName,
      slug: node.slug,
      progress: node.progress,
      computedProgress: node.computedProgress,
      weight: node.weight,
      isLeaf: node.isLeaf,
      duration: node.duration,
      startDate: node.startDate,
      finishDate: node.finishDate,
      priority: node.priority,
      actualHour: node.actualHour,
      plannedHour: node.plannedHour,
      plannedCost: node.plannedCost,
      plannedResourceCost: node.plannedResourceCost,
      children: childTrees,
    };
  }

  /**
   * Get full tree structure for a project
   */
  async getProjectTree<T>(projectId: string): Promise<T[]> {
    const rootNodes = await this.nodeRepo.findRootNodes(projectId);

    const trees = await Promise.all(
      rootNodes.map((node) => this.buildTree(node)),
    );

    return trees;
  }

  /**
   * Get flat list of all nodes in a project with their hierarchy level
   */
  async getProjectNodesFlat(projectId: string) {
    const nodes = await this.nodeRepo.findAllNodesByProject(projectId);

    // Add level information
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    const getLevel = (nodeId: string): number => {
      const node = nodeMap.get(nodeId);
      if (!node || !node.parentId) return 0;
      return 1 + getLevel(node.parentId);
    };

    return nodes.map((node) => ({
      ...node,
      level: getLevel(node.id),
    }));
  }

  checkPriority(p: Priority) {
    if (!priority.includes(p)) {
      throw new BadRequestException(
        `Priority must match with any of those [${priority}]`,
      );
    }
  }
}

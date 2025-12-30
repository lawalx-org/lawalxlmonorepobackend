import { Injectable } from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureNodeRepository } from './infrastructure-node/infrastructure-node.repository';

interface TreeNode {
  id: string;
  taskName: string;
  slug: string;
  progress: number | null;
  computedProgress: number;
  weight: number;
  isLeaf: boolean;
  children: TreeNode[];
  duration?: number;
  startDate?: Date;
  finishDate?: Date;
  priority?: number;
  actualHour?: number;
  plannedHour?: number;
  plannedCost?: number;
  plannedResourceCost?: number;
  [key: string]: any;
}

@Injectable()
export class InfrastructureService {
  constructor(
    private readonly infrastructureRepo: InfrastructureRepository,
    private readonly nodeRepo: InfrastructureNodeRepository,
  ) {}

  /**
   * Recursively propagate progress upward from a given node to its ancestors
   */
  async propagateUp(nodeId: string | null | undefined): Promise<void> {
    if (!nodeId) return;

    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (!node) return;

    // Calculate weighted average of children's computed progress
    const children = await this.nodeRepo.findChildren(nodeId);

    if (children.length === 0) {
      // No children - should be a leaf (but double-check)
      return;
    }

    const totalWeight = children.reduce((sum, child) => sum + child.weight, 0);

    if (totalWeight === 0) {
      // Avoid division by zero
      await this.nodeRepo.updateNode(nodeId, { computedProgress: 0 });
      await this.propagateUp(node.parentId);
      return;
    }

    const weightedSum = children.reduce(
      (sum, child) => sum + child.computedProgress * child.weight,
      0,
    );

    const newComputedProgress = weightedSum / totalWeight;

    await this.nodeRepo.updateNode(nodeId, {
      computedProgress: newComputedProgress,
    });

    // Continue propagating up
    await this.propagateUp(node.parentId);
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
  async buildTree(node: any): Promise<TreeNode> {
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
      rootNodes.map((node: any) => this.buildTree(node)),
    );

    return trees as any;
  }

  /**
   * Get tree structure from a specific node
   */
  async getNodeTree<T = any>(nodeId: string): Promise<T> {
    const node = await this.infrastructureRepo.findNodeById(nodeId);

    if (!node) {
      throw new Error(`Node with ID ${nodeId} not found`);
    }

    return this.buildTree(node) as T;
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
}

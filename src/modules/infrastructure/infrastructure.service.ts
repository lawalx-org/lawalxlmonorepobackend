import { Injectable } from '@nestjs/common';
import { InfrastructureRepository } from './infrastructure.repository';
import { InfrastructureNodeRepository } from './infrastructure-node/infrastructure-node.repository';

@Injectable()
export class InfrastructureService {
  constructor(
    private readonly infrastructureRepo: InfrastructureRepository,
    private readonly nodeRepo: InfrastructureNodeRepository,
  ) {}

  /**
   * Build a tree structure from a root node
   */
  async buildTree(node: any) {
    const children = await this.nodeRepo.findChildren(node.id);

    const childTrees = await Promise.all(
      children.map((child) => this.buildTree(child)),
    );

    return {
      id: node.id,
      slug: node.slug,
      children: childTrees,
      ...node,
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
  // FROM CLOUDE AI
  /**
   * Sum chart values from multiple nodes (column by column)
   *
   * Example:
   *   child1: { "Sun": 8, "Mon": 0, "Tue": 3 }
   *   child2: { "Sun": 6, "Mon": 0, "Tue": 11 }
   *   result: { "Sun": 14, "Mon": 0, "Tue": 14 }
   *
   * @param chartValuesArray - Array of chart values from multiple nodes
   * @returns Summed chart values
   */
  private sumChartValues(
    chartValuesArray: Array<Record<string, number> | null>,
  ): Record<string, number> {
    const result: Record<string, number> = {};

    // Iterate through each child's chart values
    chartValuesArray.forEach((chartValues) => {
      if (!chartValues) return;

      // Sum each column (Sun, Mon, Tue, etc.)
      Object.entries(chartValues).forEach(([key, value]) => {
        if (!result[key]) {
          result[key] = 0;
        }
        result[key] += value || 0;
      });
    });

    return result;
  }

  /**
   * Calculate computedProgress from chartValues
   * Formula: SUM(all values) / COUNT(columns)
   *
   * Example:
   *   chartValues = { "Sun": 8, "Mon": 0, "Tue": 3, "Wed": 0, "Thu": 4, "Fri": 0, "Sat": 2 }
   *   sum = 8 + 0 + 3 + 0 + 4 + 0 + 2 = 17
   *   count = 7
   *   result = 17 / 7 = 2.43
   *
   * @param chartValues - Chart values object
   * @returns Computed progress (average of all values)
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
   * *** NEW: Propagate chart values AND progress upward through the tree ***
   *
   * This replaces the old propagateUp method with chart-aware logic.
   *
   * Process:
   * 1. Get all children of the node
   * 2. Sum all children's chartValues (column by column)
   * 3. Calculate parent's computedProgress from summed chartValues
   * 4. Update parent node with summed values and calculated progress
   * 5. Continue propagating up to grandparent (recursive)
   *
   * Example:
   *   Child 1: { "Sun": 3, "Mon": 0, "Tue": 2 } -> progress: 1.67
   *   Child 2: { "Sun": 3, "Mon": 0, "Tue": 2 } -> progress: 1.67
   *   Parent:  { "Sun": 6, "Mon": 0, "Tue": 4 } -> progress: 3.33 (auto-calculated)
   *
   * @param nodeId - ID of the node to propagate from (usually a parent node)
   */
  async propagateUpWithCharts(
    nodeId: string | null | undefined,
  ): Promise<void> {
    // Base case: reached root or null node
    if (!nodeId) return;

    // Get the node
    const node = await this.infrastructureRepo.findNodeById(nodeId);
    if (!node) return;

    // Get all children
    const children = await this.nodeRepo.findChildren(nodeId);

    // If no children, this is actually a leaf node - nothing to calculate
    if (children.length === 0) {
      return;
    }

    // *** Step 1: Extract all children's chartValues ***
    const childrenChartValues = children.map(
      (child) => child.chartValues as Record<string, number> | null,
    );

    // *** Step 2: Sum all children's chartValues (column by column) ***
    // Example: If child1 has {"Sun": 3, "Tue": 2} and child2 has {"Sun": 6, "Tue": 11}
    // Result will be: {"Sun": 9, "Tue": 13}
    const summedChartValues = this.sumChartValues(childrenChartValues);

    // *** Step 3: Calculate parent's progress from summed chart values ***
    // Formula: (SUM of all values) / (COUNT of columns)
    // Example: {"Sun": 9, "Tue": 13} -> (9 + 13) / 2 = 11
    const newComputedProgress =
      this.calculateProgressFromChartValues(summedChartValues);

    // *** Step 4: Update parent node with summed values and calculated progress ***
    await this.nodeRepo.updateNode(nodeId, {
      chartValues: summedChartValues,
      computedProgress: newComputedProgress,
    });

    // *** Step 5: Continue propagating up to grandparent (recursive) ***
    // This ensures all ancestors up to the root are updated
    await this.propagateUpWithCharts(node.parentId);
  }

  /**
   * Legacy method - kept for backward compatibility
   * Redirects to new chart-aware propagation
   *
   * @param nodeId - Node ID to propagate from
   */
  async propagateUp(nodeId: string | null | undefined): Promise<void> {
    return this.propagateUpWithCharts(nodeId);
  }

  /**
   * Update project's overall progress based on root nodes
   *
   * Process:
   * 1. Get all root nodes (nodes with parentId = null)
   * 2. Calculate weighted average of their computedProgress
   * 3. Update project's progress field
   *
   * Formula:
   *   projectProgress = SUM(rootNode.computedProgress × rootNode.weight) / SUM(rootNode.weight)
   *
   * Example:
   *   Root 1: computedProgress = 10, weight = 2  -> contribution = 20
   *   Root 2: computedProgress = 5, weight = 1   -> contribution = 5
   *   Project progress = (20 + 5) / (2 + 1) = 25 / 3 = 8.33
   *
   * @param projectId - ID of the project to update
   */
  async updateProjectProgress(projectId: string): Promise<void> {
    // Get all root nodes for this project
    const rootNodes = await this.nodeRepo.findRootNodes(projectId);

    // If no root nodes exist, set project progress to 0
    if (rootNodes.length === 0) {
      await this.nodeRepo.updateProjectProgress(projectId, 0);
      return;
    }

    // *** Calculate total weight of all root nodes ***
    const totalWeight = rootNodes.reduce((sum, node) => sum + node.weight, 0);

    // If total weight is 0, set project progress to 0 to avoid division by zero
    if (totalWeight === 0) {
      await this.nodeRepo.updateProjectProgress(projectId, 0);
      return;
    }

    // *** Calculate weighted sum of all root nodes' computed progress ***
    // Each root node contributes: computedProgress × weight
    const weightedSum = rootNodes.reduce(
      (sum, node) => sum + node.computedProgress * node.weight,
      0,
    );

    // *** Calculate project progress (weighted average) ***
    const projectProgress = weightedSum / totalWeight;

    // *** Update project with calculated progress ***
    // Round to 2 decimal places for cleaner display
    await this.nodeRepo.updateProjectProgress(
      projectId,
      Math.round(projectProgress * 100) / 100,
    );
  }
}

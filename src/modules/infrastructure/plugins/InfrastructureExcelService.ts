import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import { InfrastructureRepository } from '../infrastructure.repository';
import { InfrastructureNodeService } from '../infrastructure-node/infrastructure-node.service';
import { InfrastructureNode } from 'generated/prisma';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureNodeRepository } from '../infrastructure-node/infrastructure-node.repository';

type InfrastructureNodeWithChildren = InfrastructureNode & {
  children: InfrastructureNode[] | [];
};

interface SheetData {
  name: string;
  path: string[];
  data: Record<string, any>;
  isParent: boolean;
}

// Define editable data columns based on your API response
const DATA_COLUMNS = [
  'computedProgress',
  'weight',
  'duration',
  'actualHour',
  'plannedHour',
  'plannedCost',
  'plannedResourceCost',
] as const;

@Injectable()
export class InfrastructureExcelService {
  constructor(
    private readonly repository: InfrastructureRepository,
    private readonly inNodeRepo: InfrastructureNodeRepository,
    private readonly infrastructureService: InfrastructureService,
  ) {}

  /**
   * Export a project and all its nodes to Excel format
   */
  async exportProjectToExcel(projectId: string): Promise<Buffer> {
    const project = await this.repository.findProjectById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const treeNodes =
      await this.infrastructureService.getProjectTree(projectId);
    if (!treeNodes || treeNodes.length === 0) {
      throw new BadRequestException('No nodes found');
    }

    const workbook = XLSX.utils.book_new();

    const allNodes: {
      node: InfrastructureNodeWithChildren;
      path: string[];
      sheetName: string;
    }[] = [];

    // Collect all nodes with their hierarchy paths
    const collectNodes = (
      node: InfrastructureNodeWithChildren,
      path: string[] = [],
    ) => {
      const currentPath = [...path, node.taskName];
      const sheetIndex = allNodes.length + 1;
      // Excel sheet names limited to 31 chars
      const sheetName = `${sheetIndex}. ${node.taskName}`.substring(0, 31);

      allNodes.push({ node, path: currentPath, sheetName });

      node.children?.forEach((child) =>
        collectNodes(child as InfrastructureNodeWithChildren, currentPath),
      );
    };

    treeNodes.forEach((root) =>
      collectNodes(root as InfrastructureNodeWithChildren),
    );

    // Map node IDs to sheet names for formulas
    const nodeToSheetMap = new Map<string, string>();
    allNodes.forEach(({ node, sheetName }) =>
      nodeToSheetMap.set(node.id, sheetName),
    );

    // Get all available data columns from the tree
    const availableColumns = this.extractAvailableColumns(treeNodes as any);

    // Create a sheet for each node
    allNodes.forEach(({ node, path, sheetName }) => {
      const headers = ['Tier Name', 'Hierarchy Path', ...availableColumns];
      const hasChildren = !node.isLeaf;

      // Build data row
      const dataRow = hasChildren
        ? this.buildParentRow(node, path, availableColumns, nodeToSheetMap)
        : this.buildLeafRow(node, path, availableColumns);

      // Build worksheet data
      const wsData = hasChildren
        ? [
            [
              '⚠️ WARNING: This is a PARENT node. Values are auto-calculated from children. Only edit LEAF (task) nodes.',
              '',
              ...availableColumns.map(() => ''),
            ],
            [],
            headers,
            dataRow,
          ]
        : [headers, dataRow];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      this.styleWorksheet(ws, headers.length, hasChildren);

      // Set column widths
      ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 2, 15) }));

      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    });

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  }

  /**
   * Build data row for parent (non-leaf) nodes with formulas
   */
  private buildParentRow(
    node: InfrastructureNodeWithChildren,
    path: string[],
    columns: string[],
    nodeToSheetMap: Map<string, string>,
  ): any[] {
    return [
      node.taskName,
      path.join(' > '),
      ...columns.map((col, i) => {
        // Create formula to sum values from all children
        const formulas = node.children
          ?.map((child) => {
            const childSheet = nodeToSheetMap.get(child.id);
            if (!childSheet) return null;

            // Column index in Excel (A=0, B=1, C=2...)
            const excelCol = XLSX.utils.encode_col(i + 2);

            // Escape single quotes in sheet names
            const escapedSheet = childSheet.replace(/'/g, "''");

            // Reference format: 'Sheet Name'!C2
            return `'${escapedSheet}'!${excelCol}2`;
          })
          .filter(Boolean);

        // Return formula object or 0 if no children
        return formulas?.length ? { f: formulas.join('+') } : 0;
      }),
    ];
  }

  /**
   * Build data row for leaf nodes with actual values
   */
  private buildLeafRow(
    node: InfrastructureNodeWithChildren,
    path: string[],
    columns: string[],
  ): any[] {
    return [
      node.taskName,
      path.join(' > '),
      ...columns.map((col) => {
        const value = node[col];

        // Handle different data types
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        if (value instanceof Date) return value;

        // Try to parse as number
        const parsed = Number(value);
        return isNaN(parsed) ? value : parsed;
      }),
    ];
  }

  /**
   * Extract available data columns from the tree
   */
  private extractAvailableColumns(
    nodes: InfrastructureNodeWithChildren[],
  ): string[] {
    const foundColumns = new Set<string>();

    const traverse = (n: InfrastructureNodeWithChildren) => {
      // Check each predefined data column
      DATA_COLUMNS.forEach((col) => {
        if (n[col] !== undefined && n[col] !== null) {
          foundColumns.add(col);
        }
      });

      // Traverse children
      n.children?.forEach((child) => traverse(child as any));
    };

    nodes.forEach((node) => traverse(node));

    // Return in consistent order
    return DATA_COLUMNS.filter((col) => foundColumns.has(col));
  }

  /**
   * Import Excel file and update node data
   */
  async importExcelToProject(projectId: string, fileBuffer: Buffer) {
    const project = await this.repository.findProjectById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    if (!workbook.SheetNames.length) {
      throw new BadRequestException('No sheets found in Excel file');
    }

    const sheetData: SheetData[] = [];
    const parseErrors: string[] = [];

    // Parse each sheet
    workbook.SheetNames.forEach((sheetName) => {
      try {
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<any>(sheet, {
          header: 1,
          defval: null,
        });

        let headerRow = 0;
        let dataRow = 1;

        // Check if this is a parent node (has warning note)
        if (
          rows[0]?.[0]?.toString().includes('WARNING') ||
          rows[0]?.[0]?.toString().includes('NOTE')
        ) {
          headerRow = 2;
          dataRow = 3;
        }

        const headers = rows[headerRow];
        const row = rows[dataRow];

        if (!headers || !row) {
          parseErrors.push(`Sheet "${sheetName}": Missing header or data row`);
          return;
        }

        const tierNameIndex = headers.indexOf('Tier Name');
        const pathIndex = headers.indexOf('Hierarchy Path');

        if (tierNameIndex === -1 || pathIndex === -1) {
          parseErrors.push(`Sheet "${sheetName}": Missing required columns`);
          return;
        }

        const name = row[tierNameIndex];
        const pathString = row[pathIndex];

        if (!name || !pathString) {
          parseErrors.push(`Sheet "${sheetName}": Empty name or path`);
          return;
        }

        const path = pathString
          .toString()
          .split(' > ')
          .map((p: string) => p.trim())
          .filter(Boolean);

        // Extract data columns
        const data: Record<string, any> = {};
        headers.forEach((h: string, i: number) => {
          if (h && !['Tier Name', 'Hierarchy Path'].includes(h)) {
            const value = row[i];

            // Handle different value types
            if (value === null || value === undefined || value === '') {
              data[h] = null;
            } else if (typeof value === 'number') {
              data[h] = value;
            } else {
              const parsed = Number(value);
              data[h] = isNaN(parsed) ? value : parsed;
            }
          }
        });

        sheetData.push({
          name,
          path,
          data,
          isParent: headerRow === 2,
        });
      } catch (error) {
        parseErrors.push(`Sheet "${sheetName}": ${error.message}`);
      }
    });

    if (parseErrors.length > 0) {
      throw new BadRequestException({
        message: 'Failed to parse some sheets',
        errors: parseErrors,
      });
    }

    // Update nodes with imported data
    const result = await this.updateNodesFromImport(projectId, sheetData);

    // Return updated tree
    return {
      ...result,
      tree: await this.infrastructureService.getProjectTree(projectId),
    };
  }

  /**
   * Style worksheet cells
   */
  private styleWorksheet(
    worksheet: XLSX.WorkSheet,
    columnCount: number,
    hasChildren: boolean,
  ): void {
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        const headerRow = hasChildren ? 2 : 0;
        const dataRowIndex = hasChildren ? 3 : 1;
        const noteRowIndex = 0;

        const isHeader = R === headerRow;
        const isTierNameCol = C === 0;
        const isHierarchyCol = C === 1;
        const isParentDataCell = R === dataRowIndex && C >= 2 && hasChildren;
        const isNoteRow = R === noteRowIndex && hasChildren;

        // Initialize style
        if (!worksheet[cellAddress].s) {
          worksheet[cellAddress].s = {};
        }

        // Red background for non-editable cells
        if (
          isHeader ||
          (isTierNameCol && R >= headerRow) ||
          (isHierarchyCol && R >= headerRow) ||
          isParentDataCell
        ) {
          worksheet[cellAddress].s.fill = {
            patternType: 'solid',
            fgColor: { rgb: 'FFCCCC' },
          };
        }

        // Yellow background for warning note
        if (isNoteRow) {
          worksheet[cellAddress].s.fill = {
            patternType: 'solid',
            fgColor: { rgb: 'FFFF99' },
          };
          worksheet[cellAddress].s.font = {
            bold: true,
          };
        }
      }
    }

    // Merge cells for note row
    if (hasChildren && columnCount > 0) {
      if (!worksheet['!merges']) worksheet['!merges'] = [];
      worksheet['!merges'].push({
        s: { r: 0, c: 0 },
        e: { r: 0, c: columnCount - 1 },
      });
    }
  }

  /**
   * Update database nodes with imported data
   */
  private async updateNodesFromImport(
    projectId: string,
    sheetData: SheetData[],
  ) {
    const tree = await this.infrastructureService.getProjectTree(projectId);

    // Build map: hierarchy path -> node
    const pathToNodeMap = new Map<string, InfrastructureNode>();

    const mapNodes = (
      nodes: InfrastructureNodeWithChildren[],
      parentPath: string[] = [],
    ) => {
      nodes.forEach((n) => {
        const currentPath = [...parentPath, n.taskName];
        const pathKey = currentPath.join(' > ');
        pathToNodeMap.set(pathKey, n);

        if (n.children?.length) {
          mapNodes(n.children as any, currentPath);
        }
      });
    };

    mapNodes(tree as any);

    const errors: string[] = [];
    const warnings: string[] = [];
    const updates: string[] = [];

    // Process each sheet
    for (const sheet of sheetData) {
      const pathKey = sheet.path.join(' > ');

      // Skip parent nodes
      if (sheet.isParent) {
        warnings.push(
          `Skipped parent node "${sheet.name}" - values are auto-calculated`,
        );
        continue;
      }

      // Find node by path
      const node = pathToNodeMap.get(pathKey);
      if (!node) {
        errors.push(`Node not found for path: ${pathKey}`);
        continue;
      }

      // Validate it's a leaf node
      if (!node.isLeaf) {
        errors.push(
          `Cannot edit "${sheet.name}" - only TASK (leaf) nodes can be edited`,
        );
        continue;
      }

      // Validate computedProgress if present
      if (
        sheet.data.computedProgress !== undefined &&
        sheet.data.computedProgress !== null
      ) {
        const progress = Number(sheet.data.computedProgress);
        if (isNaN(progress) || progress < 0 || progress > 100) {
          errors.push(
            `Invalid progress for "${sheet.name}": ${sheet.data.computedProgress} (must be 0-100)`,
          );
          continue;
        }
      }

      // Validate numeric fields
      const numericFields = [
        'weight',
        'duration',
        'actualHour',
        'plannedHour',
        'plannedCost',
        'plannedResourceCost',
      ];

      for (const field of numericFields) {
        if (sheet.data[field] !== undefined && sheet.data[field] !== null) {
          const value = Number(sheet.data[field]);
          if (isNaN(value)) {
            errors.push(
              `Invalid ${field} for "${sheet.name}": ${sheet.data[field]} (must be a number)`,
            );
            continue;
          }
        }
      }

      try {
        // Filter out null/undefined values
        const updateData = Object.entries(sheet.data)
          .filter(([_, value]) => value !== null && value !== undefined)
          .reduce(
            (acc, [key, value]) => {
              acc[key] = value;
              return acc;
            },
            {} as Record<string, any>,
          );

        if (Object.keys(updateData).length === 0) {
          warnings.push(`No data to update for "${sheet.name}"`);
          continue;
        }

        // Update the node
        await this.inNodeRepo.updateNode(node.id, updateData);

        // Propagate changes up the tree
        await this.infrastructureService.propagateUp(node.id);

        updates.push(`✓ Updated: ${pathKey}`);
      } catch (error) {
        errors.push(`Error updating "${sheet.name}": ${error.message}`);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Import completed with errors',
        errors,
        warnings,
        successfulUpdates: updates,
      });
    }

    return {
      success: true,
      updates,
      warnings,
      message: `Successfully updated ${updates.length} node(s)`,
    };
  }
}

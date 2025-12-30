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
import { nodeType, type NodeType } from '../contants/index';
import { InfrastructureNodeRepository } from '../infrastructure-node/infrastructure-node.repository';

type InfrastructureNodeWithChildren = InfrastructureNode & {
  children: InfrastructureNode[] | [];
};

interface SheetData {
  name: string;
  path: string[];
  data: Record<string, number>;
  isParent: boolean;
}

@Injectable()
export class InfrastructureExcelService {
  constructor(
    private readonly repository: InfrastructureRepository,
    private readonly inNodeRepo: InfrastructureNodeRepository,
    private readonly nodeService: InfrastructureNodeService,
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

    const collectNodes = (
      node: InfrastructureNodeWithChildren,
      path: string[] = [],
    ) => {
      const currentPath = [...path, node.taskName];
      const sheetIndex = allNodes.length + 1;
      const sheetName = `${sheetIndex}. ${node.taskName}`.substring(0, 31);

      allNodes.push({ node, path: currentPath, sheetName });

      node.children?.forEach((child) =>
        collectNodes(child as InfrastructureNodeWithChildren, currentPath),
      );
    };

    treeNodes.forEach((root) =>
      collectNodes(root as InfrastructureNodeWithChildren),
    );

    const nodeToSheetMap = new Map<string, string>();
    allNodes.forEach(({ node, sheetName }) =>
      nodeToSheetMap.set(node.id, sheetName),
    );

    const dataColumns = new Set<string>();
    treeNodes.forEach((root) =>
      this.extractDataColumns(root as any).forEach((c) => dataColumns.add(c)),
    );

    const sortedColumns = Array.from(dataColumns).sort();

    allNodes.forEach(({ node, path, sheetName }) => {
      const headers = ['Tier Name', 'Hierarchy Path', ...sortedColumns];
      const hasChildren = !node.isLeaf;

      const dataRow = hasChildren
        ? [
            node.taskName,
            path.join(' > '),
            ...sortedColumns.map((_, i) => {
              const formulas = node.children
                ?.map((child) => {
                  const childSheet = nodeToSheetMap.get(child.id);
                  if (!childSheet) return null;
                  const col = XLSX.utils.encode_col(i + 2);
                  return `'${childSheet}'!${col}2`;
                })
                .filter(Boolean);

              return formulas?.length ? { f: formulas.join('+') } : 0;
            }),
          ]
        : [
            node.taskName,
            path.join(' > '),
            ...sortedColumns.map((c) => node[c] ?? 0),
          ];

      const wsData = hasChildren
        ? [
            [
              '⚠️ NOTE: Please do not edit data in this sheet. Values are calculated from child sheets.',
              '',
              ...sortedColumns.map(() => ''),
            ],
            [],
            headers,
            dataRow,
          ]
        : [headers, dataRow];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      this.styleWorksheet(ws, headers.length, hasChildren);

      ws['!cols'] = headers.map((h) => ({ wch: Math.max(h.length + 2, 15) }));

      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    });

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  }

  /**
   * Import Excel file and update node data
   */
  async importExcelToProject(projectId: string, fileBuffer: Buffer) {
    const project = await this.repository.findProjectById(projectId);
    if (!project) throw new NotFoundException('Project not found');

    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    if (!workbook.SheetNames.length) {
      throw new BadRequestException('No sheets found');
    }

    const sheetData: SheetData[] = [];

    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 });

      let headerRow = 0;
      let dataRow = 1;

      if (rows[0]?.[0]?.includes('NOTE:')) {
        headerRow = 2;
        dataRow = 3;
      }

      const headers = rows[headerRow];
      const row = rows[dataRow];
      if (!headers || !row) return;

      const name = row[headers.indexOf('Tier Name')];
      const path = row[headers.indexOf('Hierarchy Path')]
        ?.split(' > ')
        .map((p: string) => p.trim());

      if (!name || !path) return;

      const data: Record<string, any> = {};
      headers.forEach((h: string, i: number) => {
        if (h && !['Tier Name', 'Hierarchy Path'].includes(h)) {
          data[h] = Number(row[i]) || 0;
        }
      });

      sheetData.push({
        name,
        path,
        data,
        isParent: headerRow === 2,
      });
    });

    await this.updateNodesFromImport(projectId, sheetData);
    return this.infrastructureService.getProjectTree(projectId);
  }

  /**
   * Extract all unique data column names from tree
   */
  private extractDataColumns(node: InfrastructureNodeWithChildren): string[] {
    const DATA_COLUMNS = [
      'computedProgress',
      'weight',
      'actualHour',
      'plannedHour',
      'plannedCost',
      'plannedResourceCost',
      'duration',
    ];

    const columns = new Set<string>();
    const traverse = (n: InfrastructureNodeWithChildren) => {
      DATA_COLUMNS.forEach((col) => {
        if (n[col] !== undefined && n[col] !== null) {
          columns.add(col);
        }
      });
      n.children?.forEach((child) => traverse(child as any));
    };

    traverse(node);
    return Array.from(columns).sort();
  }

  /**
   * Apply styling to worksheet
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

        // Red background for headers and parent cells
        if (
          isHeader ||
          (isTierNameCol && R >= headerRow) ||
          (isHierarchyCol && R >= headerRow) ||
          isParentDataCell
        ) {
          if (!worksheet[cellAddress].s) {
            worksheet[cellAddress].s = {};
          }
          worksheet[cellAddress].s.fill = {
            patternType: 'solid',
            fgColor: { rgb: 'FFCCCC' },
          };
        }

        // Yellow background for note row
        if (isNoteRow) {
          if (!worksheet[cellAddress].s) {
            worksheet[cellAddress].s = {};
          }
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
    if (hasChildren) {
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
    const nodeMap = new Map<string, string>();

    const mapNodes = (nodes: InfrastructureNodeWithChildren[]) => {
      nodes.forEach((n) => {
        nodeMap.set(n.taskName, n.id);
        if (n.children?.length) mapNodes(n.children as any);
      });
    };

    mapNodes(tree as any);

    for (const sheet of sheetData) {
      if (!sheet.isParent) {
        const nodeId = nodeMap.get(sheet.name);
        if (nodeId) {
          await this.inNodeRepo.updateNode(nodeId, sheet.data);
          await this.infrastructureService.propagateUp(nodeId);
        }
      }
    }
  }
}

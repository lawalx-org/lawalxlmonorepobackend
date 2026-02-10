import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChartName, Prisma } from 'generated/prisma';
import { CreateChartDto, WidgetDto } from '../dto';
import { Parser } from 'json2csv';

import * as csv from 'csv-parser';
import { Readable } from 'stream';

interface FlattenedChartData {
  id: string;
  parentId: string;
  level: string;
  title: string;
  category: string;
  val1: number;
  val2: number;
  val3: number;
  status: string;
}

@Injectable()
export class ChartMainService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createChartDto: CreateChartDto) {
    const { xAxis, yAxis, title, status, category, parentId, projectId, piConfig } = createChartDto;

    return await this.prisma.$transaction(async (tx) => {
      if (parentId) {
        const parent = await tx.chartTable.findUnique({ where: { id: parentId } });
        if (!parent) throw new NotFoundException('Parent chart does not exist');
      }

      const mainChart = await tx.chartTable.create({
        data: {
          title,
          parentId: parentId ?? null,
          status,
          category,
          xAxis: typeof xAxis === 'string' ? JSON.parse(xAxis) : xAxis,
          yAxis: yAxis ? (typeof yAxis === 'string' ? JSON.parse(yAxis) : yAxis) : Prisma.JsonNull,
          projectId,
        },
      });

      if (category === ChartName.PIE && piConfig) {
        await tx.pi.create({
          data: {
            chartTableId: mainChart.id,
            numberOfDataset: piConfig.numberOfDataset || 0,
            widgets: piConfig.widgets?.length ? {
              create: piConfig.widgets.map((w: WidgetDto, i: number) => ({
                legendName: w.legendName ?? 'Default',
                color: w.color ?? '#3B82F6',
                index: w.index !== undefined ? w.index : i,
                value: w.value ?? 0,
              })),
            } : undefined,
          },
        });

        if (parentId) {
          await this.syncHierarchyUpwards(parentId, tx);
        }
      }

      return mainChart;
    });
  }

  private async syncHierarchyUpwards(nodeId: string, tx: Prisma.TransactionClient) {
    const node = await tx.chartTable.findUnique({
      where: { id: nodeId },
      include: { children: true, pi: { include: { widgets: true } } }
    });

    if (!node) return;

    const isAggregator = node.children.length > 0;

    if (isAggregator) {
      const children = await tx.chartTable.findMany({
        where: { parentId: nodeId },
        select: { xAxis: true }
      });

      const childrenLabels = children
        .map((c) => (c.xAxis as any)?.labels)
        .filter(Boolean);

      if (childrenLabels.length > 0) {
        const summedLabels = this.mergeAndSumLabels(childrenLabels);

        const updated = await tx.chartTable.update({
          where: { id: nodeId },
          data: { xAxis: { labels: summedLabels } },
          include: { pi: { include: { widgets: true } } }
        });

        if (updated.pi?.widgets) {
          const values = summedLabels[0].slice(1);
          for (const widget of updated.pi.widgets) {
            await tx.widget.update({
              where: { id: widget.id },
              data: { value: Number(values[widget.index]) || 0 }
            });
          }
        }
      }
    }

    if (node.parentId) {
      await this.syncHierarchyUpwards(node.parentId, tx);
    }
  }

  private mergeAndSumLabels(allLabels: any[][]) {
    const resultMap: Record<string, number[]> = {};
    for (const labels of allLabels) {
      for (const row of labels) {
        const [key, ...values] = row;
        if (!resultMap[key]) {
          resultMap[key] = new Array(values.length).fill(0);
        }
        values.forEach((val, index) => {
          resultMap[key][index] += (Number(val) || 0);
        });
      }
    }
    return Object.entries(resultMap).map(([key, values]) => [key, ...values]);
  }

  async getChartWithCalculation(id: string) {
    const chart = await this.prisma.chartTable.findUnique({
      where: { id },
      include: {
        children: { select: { id: true, title: true, xAxis: true } },
        pi: { include: { widgets: { orderBy: { index: 'asc' } } } }
      }
    });

    if (!chart) throw new NotFoundException('Chart not found');

    return {
      ...chart,
      nodeType: chart.children.length > 0 ? (chart.parentId ? 'SUB_PARENT' : 'ROOT_PARENT') : 'LEAF',
      isAggregated: chart.children.length > 0
    };
  }

  async exportChartToCsv(mainParentId: string): Promise<string> {
    const allData = await this.getFlattenedData(mainParentId);
    const fields = [
      { label: 'ID', value: 'id' },
      { label: 'Indented Title', value: 'title' },
      { label: 'Type', value: 'level' },
      { label: 'FY 2020', value: 'val1' },
      { label: 'FY 2021', value: 'val2' },
      { label: 'FY 2022', value: 'val3' },
      { label: 'Status', value: 'status' }
    ];
    return new Parser({ fields }).parse(allData);
  }

  private async getFlattenedData(
    id: string,
    level = 0,
    flatList: FlattenedChartData[] = []
  ): Promise<FlattenedChartData[]> {
    const chart = await this.prisma.chartTable.findUnique({
      where: { id },
      include: { children: { select: { id: true } } }
    });

    if (!chart) return flatList;

    const labels = (chart.xAxis as any)?.labels?.[0] || [];
    const values = labels.slice(1);

    const indentation = level > 0 ? '    '.repeat(level) + '↳ ' : '';

    flatList.push({
      id: chart.id,
      parentId: chart.parentId || 'ROOT',
      level: chart.children.length > 0 ? (chart.parentId ? 'SUB_PARENT' : 'ROOT') : 'LEAF',
      title: `${indentation}${chart.title}`,
      category: chart.category,
      val1: Number(values[0]) || 0,
      val2: Number(values[1]) || 0,
      val3: Number(values[2]) || 0,
      status: chart.status
    });

    const children = await this.prisma.chartTable.findMany({
      where: { parentId: id },
      select: { id: true },
      orderBy: { createdAt: 'asc' }
    });

    for (const child of children) {
      await this.getFlattenedData(child.id, level + 1, flatList);
    }

    return flatList;
  }






  // async updateFromCsv(fileBuffer: Buffer): Promise<any[]> {
  //   const results: any[] = [];

  //   // ১. UTF-8 BOM স্ট্রিপ করার জন্য স্ট্রিং এ কনভার্ট করা নিরাপদ
  //   const csvString = fileBuffer.toString('utf8').replace(/^\uFEFF/, '');
  //   const stream = Readable.from(csvString);

  //   return new Promise((resolve, reject) => {
  //     stream
  //       .pipe(csv({
  //         mapHeaders: ({ header }) => header.trim(), // কলামের নামের স্পেস ক্লিন করবে
  //         mapValues: ({ value }) => value.trim()      // ডেটার স্পেস ক্লিন করবে
  //       }))
  //       .on('data', (data) => results.push(data))
  //       .on('end', async () => {
  //         try {
  //           const updatedCharts: any[] = [];

  //           console.log(`Total rows found in CSV: ${results.length}`);

  //           for (const row of results) {
  //             // ২. ডাইনামিক কি (Key) ডিটেকশন (ID কলামটি খুঁজে বের করা)
  //             const chartId = row['ID'] || row['id'] || row['Chart ID'] || row['ChartId'] || Object.values(row)[0];

  //             if (!chartId || chartId === '') {
  //               console.warn('Skipping row: Missing ID', row);
  //               continue;
  //             }

  //             // ৩. স্যালারি ভ্যালু এক্সট্রাক্ট করা (কলাম নাম যাই হোক)
  //             // আপনার CSV হেডার অনুযায়ী এগুলো পরিবর্তন করুন
  //             const val1 = Number(row['FY 2020'] || row['fy 2020'] || 0);
  //             const val2 = Number(row['FY 2021'] || row['fy 2021'] || 0);
  //             const val3 = Number(row['FY 2022'] || row['fy 2022'] || 0);

  //             try {
  //               // ৪. ডাটাবেজে আপডেট
  //               const updatedNode = await this.prisma.chartTable.update({
  //                 where: { id: String(chartId) },
  //                 data: {
  //                   xAxis: {
  //                     labels: [
  //                       ["Total Salary", val1, val2, val3]
  //                     ]
  //                   }
  //                 },
  //                 select: { id: true, parentId: true }
  //               });

  //               // ৫. অটো-সিঙ্ক ট্রিগার (বটম-আপ)
  //               if (updatedNode.parentId) {
  //                 await this.syncHierarchyUpwards(updatedNode.parentId, this.prisma);
  //               }

  //               updatedCharts.push(updatedNode);
  //               console.log(`Updated successfully: ${chartId}`);
  //             } catch (dbError) {
  //               console.error(`Database error for ID ${chartId}:`, dbError.message);
  //               // আইডি না মিললে লুপ থামবে না, পরেরটা ট্রাই করবে
  //               continue;
  //             }
  //           }

  //           console.log(`Total successful updates: ${updatedCharts.length}`);
  //           resolve(updatedCharts);
  //         } catch (error) {
  //           console.error('Processing error:', error);
  //           reject(error);
  //         }
  //       });
  //   });
  // }

  async updateFromCsv(fileBuffer: Buffer, sheetId: string): Promise<any[]> {
    const results: any[] = [];
    const csvString = fileBuffer.toString('utf8').replace(/^\uFEFF/, '');
    const stream = Readable.from(csvString);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const updatedCharts: any[] = [];
            for (const row of results) {
              const chartId = row['ID'] || row['id'];

              if (!chartId) {
                console.error('Row skipped: ID column is missing in CSV!', row);
                continue;
              }

              const updatedNode = await this.prisma.chartTable.update({
                where: { id: chartId.trim() },
                data: {
                  xAxis: {
                    labels: [
                      ["Total Salary", Number(row['FY 2020']), Number(row['FY 2021']), Number(row['FY 2022'])]
                    ]
                  }
                },
                select: { id: true, parentId: true }
              });

              if (updatedNode.parentId) {
                await this.syncHierarchyUpwards(updatedNode.parentId, this.prisma);
              }
              updatedCharts.push(updatedNode);
            }
            resolve(updatedCharts);
          } catch (error) {
            reject(error);
          }
        });
    });
  }
}
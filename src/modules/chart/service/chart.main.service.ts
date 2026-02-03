import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChartDto } from '../dto/create-chart.dto';
import { UpdateChartDto } from '../dto/update-chart.dto';
import { ChartName, ChartStatus, Prisma } from 'generated/prisma';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
@Injectable()
export class ChartMainService {
  constructor(private readonly prisma: PrismaService) { }

  //create chart
  async create(createChartDto: CreateChartDto) {
    let subChat = {};
    const { xAxis, yAxis, zAxis, title, status, category } = createChartDto;

    if (!createChartDto.projectId)
      throw new NotFoundException('ProgramId is required');

    const result = await this.prisma.$transaction(async (txPrisma) => {
      const mainChart = await txPrisma.chartTable.create({
        data: {
          title,
          status,
          category,
          xAxis: JSON.parse(xAxis),
          yAxis: yAxis ? JSON.parse(yAxis) : Prisma.JsonNull,
          zAxis: zAxis ? JSON.parse(zAxis) : Prisma.JsonNull,

          // SABBIR - Relation to program //
          projectId: createChartDto.projectId,
          // SABBIR //
        },
      });

      switch (category) {
        case ChartName.BAR: {
          const {
            numberOfDataset,
            firstFiledDataset,
            lastFiledDAtaset,
            widgets,
          } = createChartDto;

          subChat = await txPrisma.barChart.create({
            data: {
              ChartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFiledDataset: firstFiledDataset!,
              lastFiledDAtaset: lastFiledDAtaset!,

              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#000000',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.HORIZONTAL_BAR: {
          const {
            numberOfDataset,
            firstFieldDataset,
            lastFieldDataset,
            widgets,
          } = createChartDto;

          subChat = await txPrisma.horizontalBarChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,

              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#000000',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.PIE: {
          const { numberOfDataset, widgets, firstFieldDataset,
            lastFieldDataset, } = createChartDto;
          subChat = await txPrisma.pi.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.HEATMAP: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.heatMapChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    // color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.AREA: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.areaChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.LINE: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.multiAxisChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.COLUMN: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.columnChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.HISTOGRAM: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.histogramChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }
        case ChartName.PARETO: {
          const { numberOfDataset, widgets, Left_firstFieldDataset, Left_lastFieldDataset, Right_firstFieldDataset, Right_lastFieldDataset } = createChartDto;

          subChat = await txPrisma.paretoChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              Left_firstFieldDataset: Left_firstFieldDataset!,
              Left_lastFieldDataset: Left_lastFieldDataset!,
              Right_firstFieldDataset: Right_firstFieldDataset!,
              Right_lastFieldDataset: Right_lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

        case ChartName.FUNNEL: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.funnelChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.WATERFALL: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.waterFallChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.RADAR: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.radarChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

        case ChartName.DOUGHNUT: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.doughnutChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.CANDLESTICK: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.candlestickChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }
        case ChartName.STACK_BAR_HORIZONTAL: {
          const { numberOfDataset, widgets, firstFiledDataset, lastFiledDAtaset, } = createChartDto;

          subChat = await txPrisma.stackedBarChart.create({
            data: {
              ChartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFiledDataset: firstFiledDataset!,
              lastFiledDAtaset: lastFiledDAtaset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

        case ChartName.GAUGE: {
          const { widgets, startingRange, endRange, gaugeValue, chartHight, startAngle, endAngle, trackColor, strokeWidth, valueFontSize, shadeIntensity } = createChartDto;

          subChat = await txPrisma.solidGaugeChart.create({
            data: {
              chartTableId: mainChart.id,
              startingRange: startingRange!,
              endRange: endRange!,
              gaugeValue: gaugeValue!,
              chartHight: chartHight!,
              startAngle: startAngle!,
              endAngle: endAngle!,
              trackColor: trackColor!,
              strokeWidth: strokeWidth!,
              valueFontSize: valueFontSize!,
              shadeIntensity: shadeIntensity!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });

          break;
        }

         case ChartName.SCATTER: {
          const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartDto;

          subChat = await txPrisma.scatterChart.create({
            data: {
              chartTableId: mainChart.id,
              numberOfDataset: numberOfDataset!,
              firstFieldDataset: firstFieldDataset!,
              lastFieldDataset: lastFieldDataset!,
              widgets: widgets
                ? {
                  create: widgets.map((widget) => ({
                    legendName: widget.legendName ?? 'Default Legend',
                    color: widget.color ?? '#1cce0cff',
                  })),
                }
                : undefined,
            },
          });
          break;
        }

      // scatterChart

        default: {
          throw new BadRequestException(
            `Chart type "${status}" is not supported`,
          );
        }
      }
      return { ...mainChart };
    });
    return result;
  }

  //find all active charts
  async findAllActive() {
    const activeCharts = await this.prisma.chartTable.findMany({
      where: { status: ChartStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
    });

    if (!activeCharts || activeCharts.length === 0) {
      throw new NotFoundException('No active charts found');
    }

    return activeCharts;
  }

  //find all inactive charts
  async findAllInactive() {
    const inactiveCharts = await this.prisma.chartTable.findMany({
      where: { status: ChartStatus.INACTIVE },
      orderBy: { createdAt: 'desc' },
    });

    if (!inactiveCharts || inactiveCharts.length === 0) {
      throw new NotFoundException('No inactive charts found');
    }

    return inactiveCharts;
  }

  findOne(id: string) {
    return this.prisma.chartTable.findUnique({
      where: { id },
      include: {
        barChart: {
          include: {
            widgets: true,
          },
        },
        horizontalBarChart: {
          include: {
            widgets: true,
          },
        },
        pi: {
          include: {
            widgets: true,
          },
        },
        heatmap: {
          include: {
            widgets: true,
          },
        },

        sheet: true,
      },
    });
  }

  //update chart
  update(id: string, updateChartDto: UpdateChartDto) {
    const { xAxis, yAxis, zAxis, ...rest } = updateChartDto;

    const data: Prisma.ChartTableUpdateInput = { ...rest };

    if (xAxis) {
      data.xAxis = JSON.parse(xAxis);
    }
    if (yAxis) {
      data.yAxis = JSON.parse(yAxis);
    }

    if (updateChartDto.hasOwnProperty('zAxis')) {
      data.zAxis = zAxis ? JSON.parse(zAxis) : Prisma.JsonNull;
    }

    return this.prisma.chartTable.update({
      where: { id },
      data,
    });
  }

  //delete chart
  remove(id: string) {
    return this.prisma.chartTable.delete({ where: { id } });
  }



async exportToExcel(id: string, res: Response) {
  const chart = await this.prisma.chartTable.findUnique({
    where: { id },
    include: {
      pi: { include: { widgets: true } },
      barChart: { include: { widgets: true } },
      horizontalBarChart: { include: { widgets: true } },
      // add other relations as needed
    },
  });

  if (!chart) throw new NotFoundException('Chart not found');

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Chart Report');

  // --- 1. SET COLUMN WIDTHS ---
  worksheet.columns = [
    { header: 'Property', key: 'prop', width: 25 },
    { header: 'Value', key: 'val', width: 40 },
    { header: 'Additional Info', key: 'extra', width: 20 },
  ];

  // --- 2. HEADER STYLING ---
  const titleRow = worksheet.addRow(['CHART REPORT: ' + chart.title.toUpperCase()]);
  worksheet.mergeCells('A1:C1');
  titleRow.font = { name: 'Arial Black', size: 14, color: { argb: 'FFFFFFFF' } };
  titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
  titleRow.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4F81BD' },
  };

  worksheet.addRow([]); // Spacer

  // --- 3. BASIC INFO SECTION ---
  const infoData = [
    ['Category', chart.category],
    ['Status', chart.status],
    ['Project ID', chart.projectId],
    ['Created At', chart.createdAt.toDateString()],
  ];

  infoData.forEach(data => {
    const row = worksheet.addRow(data);
    row.getCell(1).font = { bold: true };
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
  });

  worksheet.addRow([]); // Spacer

  // --- 4. AXIS DATA (The Main Table) ---
  const tableHeader = worksheet.addRow(['Axis Label', 'Numeric Value', 'Percent']);
  tableHeader.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF212529' } };
    cell.border = { bottom: { style: 'thin' } };
  });

  const xAxisData = typeof chart.xAxis === 'string' ? JSON.parse(chart.xAxis) : chart.xAxis;
  if (xAxisData?.labels) {
    xAxisData.labels.forEach((item: [string, number]) => {
      worksheet.addRow([item[0], item[1], '']); 
    });
  }

  worksheet.addRow([]); // Spacer

  // --- 5. WIDGETS & COLORS ---
  const subChart = (chart as any)[chart.category.toLowerCase()] || (chart as any).pi;
  if (subChart?.widgets) {
    const widgetHeader = worksheet.addRow(['Legend Name', 'HEX Code', 'Visual Color']);
    widgetHeader.font = { bold: true };

    subChart.widgets.forEach((w: any) => {
      const row = worksheet.addRow([w.legendName, w.color, '']);
      const colorCell = row.getCell(3);
      
      // Attempt to fill the cell with the actual color from the database
      try {
        const cleanColor = w.color.replace('#', '').substring(0, 6);
        colorCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF' + cleanColor },
        };
      } catch (e) {
        /* skip color if invalid hex */
      }
    });
  }

  // --- 6. FINAL BORDERS ---
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Export
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${chart.title.replace(/\s+/g, '_')}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
}
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChartDto } from '../dto/create-chart.dto';
import { UpdateChartDto } from '../dto/update-chart.dto';
import { ChartName, ChartStatus, Prisma } from 'generated/prisma';

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
}

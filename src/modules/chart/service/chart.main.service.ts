import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChartDto } from '../dto/create-chart.dto';
import { UpdateChartDto } from '../dto/update-chart.dto';
import { ChartName, ChartStatus, Prisma } from 'generated/prisma';
import { UpdateSingleChartDto } from '../dto/update.data.dto';
import {  CloneSingleChartDto } from '../dto/clone.dto';

@Injectable()
export class ChartMainService {
  constructor(private readonly prisma: PrismaService) { }

  //create chart
  async create(createChartDto: CreateChartDto) {
    let subChat = {};
    const { xAxis, yAxis, zAxis, title, status, category, parentId, rootchart, projectId, roottitle } = createChartDto;

    if (!createChartDto.projectId)
      throw new NotFoundException('ProgramId is required');

    const result = await this.prisma.$transaction(async (txPrisma) => {

      if (parentId) {
        const parentExists = await txPrisma.chartTable.findUnique({
          where: { id: parentId },
          select: { id: true },
        });

        if (!parentExists) {
          throw new NotFoundException('Parent chart does not exist');
        }
      }
      const mainChart = await txPrisma.chartTable.create({
        data: {
          title,
          parentId: parentId ?? null,
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


      if (rootchart && roottitle) {
        const project = await txPrisma.project.findUnique({
          where: { id: projectId! },
          select: { id: true },
        });

        if (!project) {
          throw new NotFoundException('Project not found');
        }
        await txPrisma.rootChart.create({

          data: {
            value: mainChart.id,
            title: roottitle ?? null,
            projectId
          },
        });
      }


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



  async findsomelavelenode(parentId: string) {
    const samelevelnode = await this.prisma.chartTable.findMany({
      where: { parentId },
      orderBy: { createdAt: 'desc' },
    });

    if (!samelevelnode) {
      throw new NotFoundException('No chart is found');
    }

    return samelevelnode;
  }



  async valuechageCalculations(id: string ,updatedata: UpdateSingleChartDto) {

    let flag = false;
      
     const changePossible = await this.prisma.chartTable.findMany({
          where: { parentId: id }
        })

      if (changePossible.length > 0) {
        throw new Error("This is not a child subtier; it already has child records.")
      }

      
      const  history = await this.prisma.chartTable.findUnique({
       where: {id}
     })

        if (history?.xAxis) {
              await this.prisma.chartHistory.create({
          data: {
            value: history?.xAxis,
            chartId: id,
          }
        })
     }

    const updateResult = await this.prisma.chartTable.update({
      where: { id },
      data:{
          xAxis:JSON.parse( updatedata.xAxis)
      }
    })

    if(!updateResult?.parentId){
        return updateResult
    }
    
    let nodeId = updateResult?.parentId

    while (!flag) {
     
      const reuslt = await this.prisma.chartTable.findMany({
        where: { parentId: nodeId }
      })

      const tables = reuslt
      .map(item => item.xAxis)
      .filter(Boolean)

      if (!tables.length) {
        console.log("No tables found")
        break
      }
     const data =await mergeAndSum(tables)
     
     const  history = await this.prisma.chartTable.findUnique({
       where: {id: nodeId as string}
     })

        if (history?.xAxis) {
              await this.prisma.chartHistory.create({
          data: {
            value: history?.xAxis,
            chartId: nodeId,
          }
        })
     }
       
       await this.prisma.chartTable.update({
          where : {id : nodeId as string},
          data: {
            xAxis: data
          }
       })
       
      const findingParent = await this.prisma.chartTable.findUnique({
        where: { id: reuslt[0].parentId ?? undefined }
      });
      
      if (!findingParent?.parentId) {
        flag = true
      } else{
          nodeId = findingParent?.parentId
      }

     
       
    

    }
    return  updateResult ;
  }

async showHistory(chartId: string) {
  const history = await this.prisma.chartHistory.findMany({
    where: {
      chartId: chartId 
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
  return history;
}



async cloneProjectRootTrees(
  sourceProjectId: string,
  targetProjectId: string,
) {
  return this.prisma.$transaction(async (tx) => {

    // 1️⃣ Load root charts
    const project = await tx.project.findUnique({
      where: { id: sourceProjectId },
      include: { rootCharts: true },
    });

    if (!project || project.rootCharts.length === 0) {
      throw new BadRequestException('No root charts found');
    }

    const rootIds = project.rootCharts.map(r => r.value);

    // 2️⃣ Load all charts of project
    const allCharts = await tx.chartTable.findMany({
      where: { projectId: sourceProjectId },
    });

    if (!allCharts.length) {
      throw new BadRequestException('No charts found');
    }

    // 3️⃣ Build adjacency map
    const childrenMap = new Map<string, string[]>();

    for (const chart of allCharts) {
      if (!chart.parentId) continue;

      if (!childrenMap.has(chart.parentId)) {
        childrenMap.set(chart.parentId, []);
      }

      childrenMap.get(chart.parentId)!.push(chart.id);
    }

    // 4️⃣ Collect only charts reachable from roots
    const collected = new Map<string, typeof allCharts[0]>();

    const dfs = (id: string) => {
      const chart = allCharts.find(c => c.id === id);
      if (!chart || collected.has(id)) return;

      collected.set(id, chart);

      const children = childrenMap.get(id) || [];
      for (const childId of children) {
        dfs(childId);
      }
    };

    for (const rootId of rootIds) {
      dfs(rootId);
    }

    const chartsToClone = Array.from(collected.values());

    // 5️⃣ Clone charts (without parentId)
    const idMap = new Map<string, string>();

    for (const chart of chartsToClone) {
      const { id, parentId, createdAt, updatedAt, ...data } = chart;

      const newChart = await tx.chartTable.create({
        data: {
          ...data,
          parentId: null,
          projectId: targetProjectId,
        },
      });

      idMap.set(id, newChart.id);
    }

    // 6️⃣ Restore hierarchy
    for (const chart of chartsToClone) {
      if (!chart.parentId) continue;

      await tx.chartTable.update({
        where: { id: idMap.get(chart.id)! },
        data: {
          parentId: idMap.get(chart.parentId)!,
        },
      });
    }

    // 7️⃣ Create new RootChart rows
    const newRootChartIds: string[] = [];

    for (const root of project.rootCharts) {
      const newRootId = idMap.get(root.value);
      if (!newRootId) continue;

      await tx.rootChart.create({
        data: {
          title: root.title,
          value: newRootId,
          projectId: targetProjectId,
        },
      });

      newRootChartIds.push(newRootId);
    }

    return {
      message: 'Root trees cloned successfully',
      rootChartIds: newRootChartIds,
    };
  });
}


  

}


async function mergeAndSum(multipleTables) {
  if (!multipleTables.length) return [];

  const header = multipleTables[0][0];
  const resultMap = {};

  for (const table of multipleTables) {
    for (let i = 1; i < table.length; i++) {
      const row = table[i];
      const key = row[0];

      if (!resultMap[key]) {
        resultMap[key] = Array(row.length).fill(0);
        resultMap[key][0] = key;
      }

      for (let j = 1; j < row.length; j++) {
        resultMap[key][j] += row[j];
      }
    }
  }

  return [
    header,
    ...Object.values(resultMap)
  ];


}

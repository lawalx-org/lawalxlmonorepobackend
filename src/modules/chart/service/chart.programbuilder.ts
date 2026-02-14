import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChartName, ChartStatus, Prisma } from 'generated/prisma';
import { CreateChartBuildDto } from '../dto/create-chart-build.dto';

@Injectable()
export class ChartProgramBuilderService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createChartBuildDto: CreateChartBuildDto) {
        let subChat = {};
        const { title, status, category, programid, projectnumber, valueDiteacts, } = createChartBuildDto;

        const result = await this.prisma.$transaction(async (txPrisma) => {

            const mainChart = await txPrisma.chartTableProgramBuilder.create({
                data: {
                    title,
                    status,
                    category,
                    projectnumber,
                    programid,
                    valueDiteacts: {
                        create: valueDiteacts?.map((v) => ({
                            projectId: v.projectId,
                            rowname: v.rowname,
                            charttableId: v.charttableId


                        })),
                    },
                },
            });

            switch (category) {
                case ChartName.BAR: {
                    const {
                        numberOfDataset,
                        firstFiledDataset,
                        lastFiledDAtaset,
                        widgets,
                    } = createChartBuildDto;

                    subChat = await txPrisma.barChartprogrambuilder.create({
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
                    } = createChartBuildDto;

                    subChat = await txPrisma.horizontalBarChartprogrambuilder.create({
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
                        lastFieldDataset, } = createChartBuildDto;
                    subChat = await txPrisma.piprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.heatMapChartprogrambuilder.create({
                        data: {
                            chartTableId: mainChart.id,
                            numberOfDataset: numberOfDataset!,
                            firstFieldDataset: firstFieldDataset!,
                            lastFieldDataset: lastFieldDataset!,
                            widgets: widgets
                                ? {
                                    create: widgets.map((widget) => ({
                                        legendName: widget.legendName ?? 'Default Legend',
                                    })),
                                }
                                : undefined,
                        },
                    });

                    break;
                }
                case ChartName.AREA: {
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.areaChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.multiAxisChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.columnChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.histogramChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, Left_firstFieldDataset, Left_lastFieldDataset, Right_firstFieldDataset, Right_lastFieldDataset } = createChartBuildDto;

                    subChat = await txPrisma.paretoChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.funnelChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.waterFallChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.radarChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.doughnutChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.candlestickChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFiledDataset, lastFiledDAtaset, } = createChartBuildDto;

                    subChat = await txPrisma.stackedBarChartprogrambuilder.create({
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
                    const { widgets, startingRange, endRange, gaugeValue, chartHight, startAngle, endAngle, trackColor, strokeWidth, valueFontSize, shadeIntensity } = createChartBuildDto;

                    subChat = await txPrisma.solidGaugeChartprogrambuilder.create({
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
                    const { numberOfDataset, widgets, firstFieldDataset, lastFieldDataset, } = createChartBuildDto;

                    subChat = await txPrisma.scatterChartprogrambuilder.create({
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

    async findAllByProgram(programId: string) {
        const program = await this.prisma.program.findUnique({
            where: { id: programId },
        });

        if (!program) {
            throw new NotFoundException(`Program with ID ${programId} not found`);
        }

        const charts = await this.prisma.chartTableProgramBuilder.findMany({
            where: { programid: programId },
            include: {
                barChart: true,
                horizontalBarChart: true,
                pieChart: true,
                heatmapChart: true,
                areaChart: true,
                multiAxisChart: true,
                columnChart: true,
                stackedBarChart: true,
                doughnutChart: true,
                paretoChart: true,
                histogramChart: true,
                scatterChart: true,
                solidGaugeChart: true,
                funnelChart: true,
                waterFallChart: true,
                candlestickChart: true,
                radarChart: true,
                valueDiteacts: true,
                history: true,
            },
        });

        // Pre-fetch all referenced ChartTable data
        const allChartTableIds = [...new Set(charts.flatMap(c => c.valueDiteacts.map(vd => vd.charttableId)))];
        const chartTables = await this.prisma.chartTable.findMany({
            where: { id: { in: allChartTableIds } }
        });
        const chartTableMap = new Map(chartTables.map(ct => [ct.id, ct]));

        return {
            programId,
            charts: charts.map(chart => {
                const chartData =
                    chart.barChart ||
                    chart.horizontalBarChart ||
                    chart.pieChart ||
                    chart.heatmapChart ||
                    chart.areaChart ||
                    chart.multiAxisChart ||
                    chart.columnChart ||
                    chart.stackedBarChart ||
                    chart.doughnutChart ||
                    chart.paretoChart ||
                    chart.histogramChart ||
                    chart.scatterChart ||
                    chart.solidGaugeChart ||
                    chart.funnelChart ||
                    chart.waterFallChart ||
                    chart.candlestickChart ||
                    chart.radarChart;

                return {
                    id: chart.id,
                    title: chart.title,
                    category: chart.category,
                    status: chart.status,
                    chartData,
                    valueDetection: detectChartValues(
                        chart.valueDiteacts,
                        chartTableMap,
                    ),
                    history: chart.history,
                };
            }),
        };
    }
}


export function detectChartValues(
    valueDiteacts: { rowname: string, charttableId: string }[],
    chartTableMap: Map<string, any>
) {
    if (!Array.isArray(valueDiteacts)) return [];

    const resultMap = new Map<string, any[]>();

    for (const vd of valueDiteacts) {
        const ct = chartTableMap.get(vd.charttableId);
        if (!ct) continue;

        // collect all possible axes safely from the actual ChartTable
        const axes: any[] = [
            ...(Array.isArray(ct.xAxis) ? ct.xAxis : []),
            ...(Array.isArray(ct.yAxis) ? ct.yAxis : []),
            ...(Array.isArray(ct.zAxis) ? ct.zAxis : []),
        ];

        for (const row of axes) {
            if (Array.isArray(row) && row.some(item => String(item) === vd.rowname)) {
                if (!resultMap.has(vd.rowname)) {
                    resultMap.set(vd.rowname, []);
                }
                // Avoid duplicate rows for the same rowname if they appear in different axes but are identical
                const existingMatches = resultMap.get(vd.rowname)!;
                if (!existingMatches.some(existingRow => JSON.stringify(existingRow) === JSON.stringify(row))) {
                    existingMatches.push(row);
                }
            }
        }
    }

    return Array.from(resultMap.entries()).map(([rowname, matches]) => ({
        rowname,
        matches,
    }));
}


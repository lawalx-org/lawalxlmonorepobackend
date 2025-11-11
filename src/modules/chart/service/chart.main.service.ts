import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChartDto } from '../dto/create-chart.dto';
import { UpdateChartDto } from '../dto/update-chart.dto';
import { ChartStatus, Prisma } from 'generated/prisma';


@Injectable()
export class ChartMainService {
  constructor(private readonly prisma: PrismaService) {}


  //create chart
  create(createChartDto: CreateChartDto) {
    const { xAxis, yAxis, zAxis, ...rest } = createChartDto;
    return this.prisma.chartTable.create({
      data: {
        ...rest,
        xAxis: JSON.parse(xAxis),
        yAxis: JSON.parse(yAxis),
        zAxis: zAxis ? JSON.parse(zAxis) : Prisma.JsonNull,
      },
    });
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
    return this.prisma.chartTable.findUnique({ where: { id } });
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

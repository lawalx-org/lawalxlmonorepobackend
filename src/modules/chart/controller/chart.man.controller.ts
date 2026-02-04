import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';

import { CreateChartDto } from '../dto/create-chart.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChartMainService } from '../service/chart.main.service';
import { Roles } from 'src/common/jwt/roles.decorator';
import { ChartName, Role } from 'generated/prisma';

@ApiTags('chart')
@Controller('chart')
@UseGuards(AuthGuard('jwt'))
export class ChartMainController {
  constructor(private readonly chartService: ChartMainService) {}

  @Post()
  @Roles(Role.CLIENT)
  async create(@Body() createChartDto: CreateChartDto) {
    const result = await this.chartService.create(createChartDto);
    return {
      message: 'Chart created successfully',
      data: result,
    };
  }

  @Get('activeInChart')
  @Roles(Role.CLIENT)
  async findAllInactive() {
    const result = await this.chartService.findAllInactive();
    return {
      message: 'All inactive charts fetched successfully',
      data: result,
    };
  }

  @Get('activechart')
  async findAllActive() {
    const result = await this.chartService.findAllActive();
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chartService.findOne(id);
  }

  @Get('samelevelnode/:id')
  async samelevenode(@Param('id') id: string) {
    const result = await this.chartService.findsomelavelenode(id);
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }



}

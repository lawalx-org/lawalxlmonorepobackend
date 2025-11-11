import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { CreateChartDto } from '../dto/create-chart.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChartMainService } from '../service/chart.main.service';


@ApiTags('chart')
@Controller('chart')
@UseGuards(AuthGuard)
export class ChartMainController {
  constructor(private readonly chartService: ChartMainService) {}

    @Post()
  async create(@Body() createChartDto: CreateChartDto) {
    const result = await this.chartService.create(createChartDto);
    return {
      message: 'Chart created successfully',
      data: result,
    };
  }

  @Get()
 async findAllInactive() {
    const result = await this.chartService.findAllInactive();
    return {
      message: 'All inactive charts fetched successfully',
      data: result,
    };
  }


  @Get()
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


}
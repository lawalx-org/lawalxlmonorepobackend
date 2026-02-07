import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  HttpStatus,
  Patch
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChartMainService } from '../service/chart.main.service';
import { Roles } from 'src/common/jwt/roles.decorator';
import { CreateChartDto } from '../dto/create-chart.dto';
import { Role } from 'generated/prisma';
import { UpdateSingleChartDto } from '../dto/update.data.dto';
import { CloneSingleChartDto } from '../dto/clone.dto';


@ApiTags('chart')
@Controller('chart')
@UseGuards(AuthGuard('jwt'))
export class ChartMainController {
  constructor(private readonly chartService: ChartMainService) { }

  @Post()
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Create a new chart' })
  async create(@Body() createChartDto: CreateChartDto) {
    const result = await this.chartService.create(createChartDto);
    return {
      message: 'Chart created successfully',
      data: result,
    };
  }

  @Get('inactive') // Renamed for clarity: matches 'findAllInactive' logic
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Fetch all inactive charts' })
  async findAllInactive() {
    const result = await this.chartService.findAllInactive();
    return {
      message: 'All inactive charts fetched successfully',
      data: result,
    };
  }

  @Get('active') // Renamed for clarity: matches 'findAllActive' logic
  @ApiOperation({ summary: 'Fetch all active charts' })
  async findAllActive() {
    const result = await this.chartService.findAllActive();
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chart details by ID' })
  findOne(@Param('id') id: string) {
    return this.chartService.findOne(id);
  }

  @Get('findChildrenValue/:id')
  async samelevenode(@Param('id') id: string) {
    const result = await this.chartService.findsomelavelenode(id);
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }

  @Patch('updateChartValue/:id')
  async value(@Param('id') id: string, @Body() updateChartDto: UpdateSingleChartDto) {
    const result = await this.chartService.valuechageCalculations(id, updateChartDto);
    return {
      message: 'All charts active fetched successfully',
      data: result,
    };
  }


  @Get('all-chart-history/:projectId')
  @Roles('CLIENT')
  async getchartHistoty(@Param('projectId') chartId: string) {
    const data = await this.chartService.showHistory(chartId)
    return data
  }


  @Get()
  @Roles('SUPERADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Create a new chart' })
  async StoreTempleted(@Body() cloneChart: CloneSingleChartDto ) {
    const result = await this.chartService.Storetempleted(cloneChart);
    return {
      message: 'Chart templeted stored successfully',
      data: result,
    };
  }


}

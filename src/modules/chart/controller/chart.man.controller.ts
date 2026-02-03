import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Res, 
  HttpStatus 
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

@ApiTags('chart')
@Controller('chart')
@UseGuards(AuthGuard('jwt'))
export class ChartMainController {
  constructor(private readonly chartService: ChartMainService) {}

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

  // --- EXCEL EXPORT ROUTE ---
  @Get(':id/export-excel')
  @Roles(Role.CLIENT) // Optional: restrict who can export
  @ApiOperation({ 
    summary: 'Export chart data to Excel', 
    description: 'Generates an .xlsx file containing the chart axes, metadata, and widget information.' 
  })
  @ApiParam({ name: 'id', description: 'The unique ID of the ChartTable record' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The Excel file has been successfully generated.',
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async exportExcel(@Param('id') id: string, @Res() res: Response) {
    // This calls the method we created in the service earlier
    return await this.chartService.exportToExcel(id, res);
  }
}
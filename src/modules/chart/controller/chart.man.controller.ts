import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChartMainService } from '../service/chart.main.service';
import { Roles } from 'src/common/jwt/roles.decorator';
import { CreateChartDto } from '../dto/create-chart.dto';
import { Role } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('chart')
@Controller('chart')
@UseGuards(AuthGuard('jwt'))
export class ChartMainController {
  constructor(
    private readonly chartService: ChartMainService
  ) { }

  @Post()
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Create a new hierarchical chart (Pie/Bar/etc.)' })
  @ApiResponse({ status: 201, description: 'Chart created and hierarchy aggregated successfully.' })
  async create(@Body() createChartDto: CreateChartDto) {
    const result = await this.chartService.create(createChartDto);
    return {
      success: true,
      message: 'Chart created and aggregated successfully',
      data: result,
    };
  }

  @Get(':id/calculate')
  @ApiOperation({ summary: 'Get a chart with calculated hierarchical data' })
  async getCalculatedChart(@Param('id') id: string) {
    const result = await this.chartService.getChartWithCalculation(id);
    return {
      success: true,
      data: result,
    };
  }

  @Get('export-csv/:id')
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Export hierarchical chart data to CSV' })
  @ApiResponse({ status: 200, description: 'CSV file download.' })
  async exportCsv(
    @Param('id') id: string,
    @Res() res: Response
  ) {
    try {
      const csv = await this.chartService.exportChartToCsv(id);

      const fileName = `salary_report_${id}_${new Date().toISOString().split('T')[0]}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`
      );

      return res.status(HttpStatus.OK).send(csv);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to export CSV',
        error: error.message,
      });
    }
  }
  // @Post('upload-csv')
  // @ApiConsumes('multipart/form-data')
  // @ApiOperation({ summary: 'Upload CSV and auto-sync hierarchy' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })

  // async uploadCsv(@UploadedFile() file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('no file');
  //   }

  //   if (!file.originalname.match(/\.(csv)$/)) {
  //     throw new BadRequestException('csv only');
  //   }

  //   const result = await this.chartService.updateFromCsv(file.buffer);

  //   return {
  //     success: true,
  //     message: `${result.length} update।`,
  //     data: result,
  //   };
  // }

  @Post('upload-csv/:sheetId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload CSV for a specific sheet/parent' })
  @ApiBody({
    description: 'CSV ফাইল আপলোড করুন (অবশ্যই "file" কি-তে ফাইল পাঠাতে হবে)',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCsv(
    @Param('sheetId') sheetId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('no file');
    }

    const result = await this.chartService.updateFromCsv(file.buffer, sheetId);

    return {
      success: true,
      message: ` ${sheetId}-skdlfnl ${result.length} update `,
      data: result
    };
  }


}
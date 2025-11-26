import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { ChartService } from '../service/chart.service';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('charts')
@Controller('charts')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Get('submission-status')
  async getSubmissionStatusChartData(
    @Req() req: RequestWithUser,
    @Query('period') period: string,
  ) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    return this.chartService.getSubmissionStatusChartData(employeeId, period);
  }

  @Get('top-overdue-projects')
  async getTopOverdueProjectsChartData(@Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    return this.chartService.getTopOverdueProjectsChartData(employeeId);
  }

  @Get('project/:projectId')
  async getChartsByProjectId(@Param('projectId') projectId: string) {
    return this.chartService.getChartsByProjectId(projectId);
  }
}

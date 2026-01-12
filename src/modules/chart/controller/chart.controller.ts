import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ChartService } from '../service/chart.service';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';

@ApiTags('charts')
@Controller('charts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChartController {
  constructor(private readonly chartService: ChartService) { }

  @Get('submission-status')
  @Roles('EMPLOYEE')
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
  @Roles('EMPLOYEE')
  async getTopOverdueProjectsChartData(@Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    return this.chartService.getTopOverdueProjectsChartData(employeeId);
  }

  @Get('project/:projectId')
  // @Roles('EMPLOYEE')
  @Roles('CLIENT')
  async getChartsByProjectId(@Param('projectId') projectId: string) {
    return this.chartService.getChartsByProjectId(projectId);
  }
}

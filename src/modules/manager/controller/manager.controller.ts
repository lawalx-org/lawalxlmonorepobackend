import {
  Controller,
  Get,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { ChartService } from '../../chart/service/chart.service';
import { ManagerService } from '../service/manager.service';

@Controller('manager')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagerController {
  constructor(
    private readonly chartService: ChartService,
    private readonly managerService: ManagerService,
  ) {}

  @Get('dashboard')
  @Roles('MANAGER')
  async getManagerDashboard(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getManagerDashboard(managerId);
  }

  @Get('projects/live')
  @Roles('MANAGER')
  async getLiveProjects(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getLiveProjects(managerId);
  }

  @Get('projects/overdue')
  @Roles('MANAGER')
  async getOverdueProjects(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getOverdueProjects(managerId);
  }

  @Get('submissions/returns')
  @Roles('MANAGER')
  async getSubmissionReturns(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getSubmissionReturns(managerId);
  }

  @Get('performance')
  @Roles('MANAGER')
  async getManagerPerformance(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return this.managerService.getManagerPerformance(managerId);
  }

  @Get('charts/submission-status')
  @Roles('MANAGER')
  async getSubmissionStatusChartData(
    @Req() req: RequestWithUser,
    @Query('period') period: string,
  ) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return await this.chartService.getManagerSubmissionStatusChartData(
      managerId,
      period,
    );
  }

  @Get('charts/top-overdue-projects')
  @Roles('MANAGER')
  async getTopOverdueProjectsChartData(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return await this.chartService.getManagerTopOverdueProjectsChartData(
      managerId,
    );
  }

  @Get('submitted-status')
  @Roles('MANAGER')
  async showSubmittedEmployeeStatus_Result(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }
    return await this.managerService.showSubmittedEmployeeStatus_Result();
  }
}

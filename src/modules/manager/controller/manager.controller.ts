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
import { GetSubmissionStatusQueryDto } from '../dto/get-submission-status.dto';

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
  @Get('projects/top-overdue')
  @Roles('MANAGER')
  async getTopOverdue(@Req() req: RequestWithUser) {
    const managerId = req.user.managerId;
    if (!managerId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }

    const result = await this.managerService.getTopOverdueProjects(managerId);

    return {
      statusCode: 200,
      success: true,
      message: 'Top overdue projects fetched successfully',
      data: result,
    };
  }

  // @Get('submission-status')
  // @Roles('MANAGER')
  // async getSubmissionStatus(@Req() req: RequestWithUser) {
  //   const managerId = req.user.managerId;

  //   if (!managerId) {
  //     throw new UnauthorizedException('Employee ID not found in token');
  //   }

  //   const result = await this.managerService.getSubmissionStatus(managerId);

  //   return {
  //     statusCode: 200,
  //     success: true,
  //     message: 'Submission status fetched successfully',
  //     data: result,
  //   };
  // }
  @Get('submission-status')
  @Roles('MANAGER')
  async getSubmissionStatus(
    @Req() req: RequestWithUser,
    @Query() query: GetSubmissionStatusQueryDto,
  ) {
    const managerId = req.user.managerId;

    if (!managerId) {
      throw new UnauthorizedException('Manager ID not found in token');
    }

    const now = new Date();

    const selectedMonth = query.month
      ? Number(query.month)
      : now.getMonth() + 1;
    const selectedYear = query.year ? Number(query.year) : now.getFullYear();

    const result = await this.managerService.getSubmissionStatus(
      managerId,
      selectedMonth,
      selectedYear,
    );

    return {
      statusCode: 200,
      success: true,
      message: 'Submission status fetched successfully',
      data: result,
    };
  }
}

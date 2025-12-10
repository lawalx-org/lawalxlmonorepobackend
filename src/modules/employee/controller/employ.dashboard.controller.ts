import {
  Controller,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/common/jwt/jwt.guard';
import { RolesGuard } from 'src/common/jwt/roles.guard';
import { Roles } from 'src/common/jwt/roles.decorator';
import { RequestWithUser } from 'src/types/RequestWithUser';
import { EmployDashboardService } from '../service/employ.dashboard.service';

@Controller('employeeDashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployDashboardController {
  constructor(private readonly employService: EmployDashboardService) {}

  @Get('dashboard')
  @Roles('EMPLOYEE')
  async getEmployeeDashboard(@Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const result = await this.employService.getEmployeeDashboard(employeeId);
    return { message: 'Employee dashboard fetched successfully', data: result };
  }

  @Get('projects/live')
  @Roles('EMPLOYEE')
  async getLiveProjects(@Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const result = await this.employService.getLiveProjects(employeeId);
    return { message: 'Live projects fetched successfully', data: result };
  }

  @Get('projects/overdue')
  @Roles('EMPLOYEE')
  async getOverdueProjects(@Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const result = await this.employService.getOverdueProjects(employeeId);
    return { message: 'Overdue projects fetched successfully', data: result };
  }

  @Get('submissions/returns')
  @Roles('EMPLOYEE')
  async getSubmissionReturns(@Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const result = await this.employService.getSubmissionReturns(employeeId);
    return { message: 'Submission returns fetched successfully', data: result };
  }

  @Get('performance')
  @Roles('EMPLOYEE')
  async getEmployeePerformance(@Req() req: RequestWithUser) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }
    const result = await this.employService.getEmployeePerformance(employeeId);
    return {
      message: 'Employee performance fetched successfully',
      data: result,
    };
  }
}

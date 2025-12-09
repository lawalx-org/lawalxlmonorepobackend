import { Controller, Get, Query, UseGuards, Param, Res, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';
import { ActivityService } from '../service/activity.service';
import {
  QueryActivityDto,
  ActivityResponseDto,
  UuidParamDto,
  UserIdParamDto,
  CreateActivityDto,
} from '../dto';
import { JwtAuthGuard } from '../../../common/jwt/jwt.guard';
import {
  GetAllActivitiesDecorators,
  GetActivityByIdDecorators,
  GetUserActivitiesDecorators,
  ExportActivitiesDecorators,
} from '../utils/activity.decorators';
import { Request } from 'express';
import { RequestWithUser } from 'src/types/RequestWithUser';

@ApiTags('Activity')
@ApiSecurity('auth')
@UseGuards(JwtAuthGuard)
@Controller('activities')


export class ActivityController {
  constructor(private activityService: ActivityService) { }


  @Post('create-activity')
  async createActivity(
    @Body() data: CreateActivityDto,
    @Req() req: RequestWithUser,
  ) {
    const employeeId = req.user.employeeId;
    if (!employeeId) {
      throw new UnauthorizedException('Employee ID not found in token');
    }

    const ipAddress = this.getClientIp(req);
    return this.activityService.createActivityForEmployee(employeeId, data, ipAddress);
  }

  private getClientIp(req: RequestWithUser): string {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor && typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    } else if (req.socket?.remoteAddress) {
      return req.socket.remoteAddress === '::1' ? '127.0.0.1' : req.socket.remoteAddress;
    }
    return '0.0.0.0';
  }




  // Get all activities with optional filters
  @Get()
  @GetAllActivitiesDecorators()
  async getActivities(
    @Query() query: QueryActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.activityService.getActivities(query);
  }

  // Export activities as CSV
  @Get('export')
  @ExportActivitiesDecorators()
  async exportActivities(
    @Query() query: QueryActivityDto,
    @Res() res: Response,
  ) {
    const csv = await this.activityService.exportActivitiesAsCsv(query);
    res.send(csv);
  }

  // Get activity by ID
  @Get(':id')
  @GetActivityByIdDecorators()
  async getActivityById(@Param() params: UuidParamDto) {
    return this.activityService.getActivityById(params.id);
  }

  // Get activities by user ID
  @Get('user/:userId')
  @GetUserActivitiesDecorators()
  async getUserActivities(
    @Param() params: UserIdParamDto,
    @Query() query: QueryActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.activityService.getUserActivities(params.userId, query);
  }


}

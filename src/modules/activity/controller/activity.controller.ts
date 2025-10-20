import { Controller, Get, Query, UseGuards, Param, Res } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Response } from 'express';
import { ActivityService } from '../service/activity.service';
import {
  QueryActivityDto,
  ActivityResponseDto,
  UuidParamDto,
  UserIdParamDto,
} from '../dto';
import { JwtAuthGuard } from '../../../common/jwt/jwt.guard';
import {
  GetAllActivitiesDecorators,
  GetActivityByIdDecorators,
  GetUserActivitiesDecorators,
  ExportActivitiesDecorators,
} from '../utils/activity.decorators';

@ApiTags('Activity')
@ApiSecurity('auth')
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

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

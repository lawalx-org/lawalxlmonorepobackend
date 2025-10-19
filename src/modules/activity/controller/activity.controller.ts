import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Header,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiSecurity,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ActivityService } from '../service/activity.service';
import {
  QueryActivityDto,
  ActivityResponseDto,
  UuidParamDto,
  UserIdParamDto,
} from '../dto';
import { JwtAuthGuard } from '../../../common/jwt/jwt.guard';

@ApiTags('Activity')
@ApiSecurity('auth')
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  // Get all activities with filters
  @Get()
  @ApiOperation({ summary: 'Get all activities with filters' })
  @ApiResponse({
    status: 200,
    description: 'Activities retrieved successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  async getActivities(
    @Query() query: QueryActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.activityService.getActivities(query);
  }

  // Export activities as CSV
  @Get('export')
  @ApiOperation({ summary: 'Export activities as CSV' })
  @ApiResponse({ status: 200, description: 'CSV file generated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiNotFoundResponse({ description: 'No activities found to export' })
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="activities.csv"')
  async exportActivities(
    @Query() query: QueryActivityDto,
    @Res() res: Response,
  ) {
    const activities = await this.activityService.exportActivities(query);

    const csv = [
      'Timestamp,User,Description,Project Name,IP Address',
      ...activities.map(
        (a) =>
          `${a.timestamp},"${a.user}","${a.description}","${a.projectName}","${a.ipAddress}"`,
      ),
    ].join('\n');

    res.send(csv);
  }

  // Get activity by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({ status: 200, description: 'Activity retrieved successfully' })
  @ApiBadRequestResponse({ description: 'Invalid activity ID format' })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async getActivityById(@Param() params: UuidParamDto) {
    return this.activityService.getActivityById(params.id);
  }

  // Get activities by user ID
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get activities by user ID' })
  @ApiResponse({
    status: 200,
    description: 'User activities retrieved successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid user ID format' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUserActivities(
    @Param() params: UserIdParamDto,
    @Query() query: QueryActivityDto,
  ): Promise<ActivityResponseDto> {
    return this.activityService.getUserActivities(params.userId, query);
  }
}

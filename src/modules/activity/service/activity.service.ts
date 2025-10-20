import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  QueryActivityDto,
  ActivityResponseDto,
  CreateActivityDto,
} from '../dto';
import { CsvHelper } from '../utils/csv.helper';
import { ActivityQueryBuilder } from '../utils/query-builder.helper';
import { ActivityMapper } from '../utils/activity-mapper.helper';
import { ActivityValidator } from '../utils/activity-validator.helper';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async getActivities(query: QueryActivityDto): Promise<ActivityResponseDto> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = ActivityQueryBuilder.buildWhereClause(query);

    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: { select: { id: true, name: true, profileImage: true } },
          project: { select: { name: true } },
        },
      }),
      this.prisma.activity.count({ where }),
    ]);

    return {
      data: activities.map(ActivityMapper.mapToDto),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getActivityById(id: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
        project: { select: { name: true } },
      },
    });

    if (!activity) throw new NotFoundException('Activity not found');

    return ActivityMapper.mapToDto(activity);
  }

  async getUserActivities(
    userId: string,
    query: QueryActivityDto,
  ): Promise<ActivityResponseDto> {
    const { page = 1, limit = 20, includeIp = false } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...ActivityQueryBuilder.buildWhereClause(query, false),
      userId,
    };

    const [activities, total, user] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: { project: { select: { name: true } } },
      }),
      this.prisma.activity.count({ where }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, profileImage: true, role: true },
      }),
    ]);

    if (!user) throw new NotFoundException('User not found');

    return {
      data: activities.map((a) =>
        ActivityMapper.mapUserActivityToDto(a, includeIp),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        user: {
          id: user.id,
          name: user.name,
          avatar: user.profileImage || undefined,
          role: user.role,
        },
      },
    };
  }

  async exportActivities(query: QueryActivityDto) {
    const where = ActivityQueryBuilder.buildWhereClause(query);

    const activities = await this.prisma.activity.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 10000,
      include: {
        user: { select: { name: true } },
        project: { select: { name: true } },
      },
    });

    if (activities.length === 0) {
      throw new NotFoundException('No activities found to export');
    }

    if (activities.length >= 10000) {
      throw new BadRequestException(
        'Too many records to export. Please apply more specific filters.',
      );
    }

    return activities.map((activity) => ({
      timestamp: activity.timestamp.toISOString(),
      user: activity.user.name,
      description: activity.description,
      projectName: activity.project.name,
      ipAddress: activity.ipAddress || '',
    }));
  }

  async exportActivitiesAsCsv(query: QueryActivityDto): Promise<string> {
    const activities = await this.exportActivities(query);
    return CsvHelper.generateActivitiesCsv(activities);
  }

  async createActivity(data: CreateActivityDto) {
    await ActivityValidator.validateUserAndProject(
      this.prisma,
      data.userId,
      data.projectId,
    );

    return this.prisma.activity.create({ data });
  }
}

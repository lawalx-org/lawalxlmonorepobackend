import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryActivityDto, ActivityResponseDto } from '../dto';
import { ActivityActionType } from 'generated/prisma';
import { DateRangeHelper } from '../helpers/date-range.helper';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async getActivities(query: QueryActivityDto): Promise<ActivityResponseDto> {
    const {
      page = 1,
      limit = 20,
      userId,
      projectId,
      search,
      dateRange,
      startDate,
      endDate,
    } = query;

    // Validate date range
    DateRangeHelper.validateDateRange(startDate, endDate);

    const skip = (page - 1) * limit;

    const where: any = {};

    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;

    // Multiple field search
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { ipAddress: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Handle date filtering
    if (dateRange) {
      where.timestamp = DateRangeHelper.getDateRangeFromPreset(dateRange);
    } else if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

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

    const data = activities.map((activity) => ({
      id: activity.id,
      timestamp: activity.timestamp,
      user: {
        id: activity.user.id,
        name: activity.user.name,
        avatar: activity.user.profileImage || undefined,
      },
      description: activity.description,
      projectName: activity.project.name,
      ipAddress: activity.ipAddress || undefined,
      actionType: activity.actionType,
      metadata: activity.metadata || undefined,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return {
      id: activity.id,
      timestamp: activity.timestamp,
      user: {
        id: activity.user.id,
        name: activity.user.name,
        avatar: activity.user.profileImage || undefined,
      },
      description: activity.description,
      projectName: activity.project.name,
      ipAddress: activity.ipAddress || undefined,
      actionType: activity.actionType,
      metadata: activity.metadata || undefined,
    };
  }

  async getUserActivities(
    userId: string,
    query: QueryActivityDto,
  ): Promise<ActivityResponseDto> {
    const {
      page = 1,
      limit = 20,
      search,
      dateRange,
      startDate,
      endDate,
      includeIp = false,
    } = query;

    // Validate date range
    DateRangeHelper.validateDateRange(startDate, endDate);

    const skip = (page - 1) * limit;

    const where: any = { userId };

    // Multiple field search (excluding user name since it's single user)
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
      ];

      // Only search IP if includeIp is true
      if (includeIp) {
        where.OR.push({ ipAddress: { contains: search, mode: 'insensitive' } });
      }
    }

    // Handle date filtering
    if (dateRange) {
      where.timestamp = DateRangeHelper.getDateRangeFromPreset(dateRange);
    } else if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [activities, total, user] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          project: { select: { name: true } },
        },
      }),
      this.prisma.activity.count({ where }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, profileImage: true, role: true },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data = activities.map((activity) => {
      const result: any = {
        id: activity.id,
        timestamp: activity.timestamp,
        description: activity.description,
        projectName: activity.project.name,
        actionType: activity.actionType,
        metadata: activity.metadata || undefined,
      };

      // Conditionally include IP address
      if (includeIp) {
        result.ipAddress = activity.ipAddress || undefined;
      }

      return result;
    });

    return {
      data,
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
    const { userId, projectId, search, dateRange, startDate, endDate } = query;

    // Validate date range
    DateRangeHelper.validateDateRange(startDate, endDate);

    const where: any = {};

    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;

    // Multiple field search
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { ipAddress: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (dateRange) {
      where.timestamp = DateRangeHelper.getDateRangeFromPreset(dateRange);
    } else if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const activities = await this.prisma.activity.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 10000, // Limit export to 10,000 records
      include: {
        user: { select: { name: true } },
        project: { select: { name: true } },
      },
    });

    // Check if no activities found
    if (activities.length === 0) {
      throw new NotFoundException('No activities found to export');
    }

    // Warn if too many records
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

  //TODO: Add Quick Actions features Here

  async createActivity(data: {
    userId: string;
    projectId: string;
    description: string;
    actionType: ActivityActionType;
    ipAddress?: string;
    metadata?: any;
  }) {
    return this.prisma.activity.create({ data });
  }
}

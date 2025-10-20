import { DateRangeHelper } from './date-range.helper';
import { QueryActivityDto } from '../dto';

export class ActivityQueryBuilder {
  static buildWhereClause(
    query: QueryActivityDto,
    includeUserSearch = true,
  ): any {
    const { userId, projectId, search, dateRange, startDate, endDate } = query;

    DateRangeHelper.validateDateRange(startDate, endDate);

    const where: any = {};

    if (userId) where.userId = userId;
    if (projectId) where.projectId = projectId;

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { project: { name: { contains: search, mode: 'insensitive' } } },
        { ipAddress: { contains: search, mode: 'insensitive' } },
      ];

      if (includeUserSearch) {
        where.OR.push({
          user: { name: { contains: search, mode: 'insensitive' } },
        });
      }
    }

    if (dateRange) {
      where.timestamp = DateRangeHelper.getDateRangeFromPreset(dateRange);
    } else if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    return where;
  }
}

import { BadRequestException } from '@nestjs/common';
import { DateRangePreset } from '../dto';

export class DateRangeHelper {
  private static readonly MAX_DATE_RANGE_DAYS = 365;

  /**
   * Validate date range inputs for correctness and limits
   */
  static validateDateRange(startDate?: string, endDate?: string): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      if (start > end) {
        throw new BadRequestException('Start date must be before end date');
      }

      const daysDiff =
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > this.MAX_DATE_RANGE_DAYS) {
        throw new BadRequestException(
          `Date range cannot exceed ${this.MAX_DATE_RANGE_DAYS} days`,
        );
      }
    }
  }

  /**
   * Convert date range preset to Prisma date filter
   */
  static getDateRangeFromPreset(preset: DateRangePreset): {
    gte?: Date;
    lte?: Date;
  } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (preset) {
      case DateRangePreset.TODAY:
        return { gte: today };

      case DateRangePreset.YESTERDAY: {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { gte: yesterday, lte: today };
      }

      case DateRangePreset.LAST_7_DAYS: {
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return { gte: last7Days };
      }

      case DateRangePreset.LAST_30_DAYS: {
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return { gte: last30Days };
      }

      case DateRangePreset.LAST_WEEK: {
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);
        return { gte: lastWeekStart };
      }

      case DateRangePreset.THIS_MONTH: {
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { gte: thisMonthStart };
      }

      case DateRangePreset.LAST_MONTH: {
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
        return { gte: lastMonthStart, lte: lastMonthEnd };
      }

      default:
        return {};
    }
  }
}

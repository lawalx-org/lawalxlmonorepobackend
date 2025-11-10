import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RepeatInterval } from 'generated/prisma';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  calculateNextTriggerAt(
    repeatEvery: RepeatInterval,
    currentDate: Date,
    repeatOnDays?: string[],
    repeatOnDates?: number[],
    remindBefore?: number,
  ): Date {
    let nextDate = dayjs(currentDate);

    switch (repeatEvery) {
      case 'WEEKLY':
        if (repeatOnDays && repeatOnDays.length > 0) {
          const weekDays = [
            'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
          ];
          const currentDay = nextDate.day();
          let nextDayIndex = -1;

          // Find the next valid day in the current week
          for (let i = 0; i < 7; i++) {
            const dayIndex = (currentDay + i) % 7;
            if (repeatOnDays.includes(weekDays[dayIndex])) {
              nextDayIndex = dayIndex;
              break;
            }
          }

          if (nextDayIndex !== -1) {
            nextDate = nextDate.day(nextDayIndex);
            if (nextDate.isBefore(dayjs(currentDate))) {
              nextDate = nextDate.add(1, 'week');
            }
          }
        } else {
          nextDate = nextDate.add(1, 'week');
        }
        break;
      case 'BI_WEEKLY':
      case 'MONTHLY':
        if (repeatOnDates && repeatOnDates.length > 0) {
          const currentMonthDate = nextDate.date();
          let nextMonthDate = -1;

          // Find the next valid date in the current month
          for (const date of repeatOnDates) {
            if (date > currentMonthDate) {
              nextMonthDate = date;
              break;
            }
          }

          if (nextMonthDate !== -1) {
            nextDate = nextDate.date(nextMonthDate);
          } else {
            nextDate = nextDate.add(1, 'month').date(repeatOnDates[0]);
          }
        } else {
          nextDate = nextDate.add(repeatEvery === 'BI_WEEKLY' ? 2 : 1, 'month');
        }
        break;
    }

    if (remindBefore) {
      nextDate = nextDate.subtract(remindBefore, 'day');
    }

    return nextDate.toDate();
  }

  @Cron('*/1 * * * *')
  async handleCron() {
    this.logger.log('Scheduler running...');
    const now = dayjs().toDate();

    // 1. Fetch due tasks
    const dueTasks = await this.prisma.reminder.findMany({
      where: {
        isActive: true,
        nextTriggerAt: { lte: now },
        project: {
          status: 'ACTIVE',
        },
      },
      include: {
        project: true,
      },
    });

    if (!dueTasks.length) return;

    // 2. Push to queue
    for (const task of dueTasks) {
      await this.notificationQueue.add('send', {
        userId: task.project.userId,
        message: task.message,
      });

      // 3. Reschedule next trigger if repeatable
      if (task.repeatEvery && task.nextTriggerAt) {
        const nextDate = this.calculateNextTriggerAt(
          task.repeatEvery,
          task.nextTriggerAt,
          task.repeatOnDays,
          task.repeatOnDates,
          task.remindBefore ?? undefined,
        );

        if (nextDate) {
          await this.prisma.reminder.update({
            where: { id: task.id },
            data: { nextTriggerAt: nextDate },
          });
        }
      }
    }

    this.logger.log(`Queued ${dueTasks.length} tasks`);
  }
}

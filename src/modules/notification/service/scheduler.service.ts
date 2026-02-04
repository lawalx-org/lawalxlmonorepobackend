import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { DayOfWeek, UploadCycle } from 'generated/prisma';

@Injectable()
// export class SchedulerService {
//   private readonly logger = new Logger(SchedulerService.name);

//   constructor(
//     private readonly prisma: PrismaService,
//     @InjectQueue('notification') private notificationQueue: Queue,
//   ) {}

//   calculateNextTriggerAt(
//     repeatEvery: RepeatInterval,
//     currentDate: Date,
//     repeatOnDays?: string[],
//     repeatOnDates?: number[],
//     remindBefore?: number,
//   ): Date {
//     let nextDate = dayjs(currentDate);

//     switch (repeatEvery) {
//       case 'WEEKLY':
//         if (repeatOnDays && repeatOnDays.length > 0) {
//           const weekDays = [
//             'SUNDAY',
//             'MONDAY',
//             'TUESDAY',
//             'WEDNESDAY',
//             'THURSDAY',
//             'FRIDAY',
//             'SATURDAY',
//           ];
//           const currentDay = nextDate.day();
//           let nextDayIndex = -1;

//           // Find the next valid weekday
//           for (let i = 0; i < 7; i++) {
//             const dayIndex = (currentDay + i) % 7;
//             if (repeatOnDays.includes(weekDays[dayIndex])) {
//               nextDayIndex = dayIndex;
//               break;
//             }
//           }

//           if (nextDayIndex !== -1) {
//             nextDate = nextDate.day(nextDayIndex);
//             if (nextDate.isBefore(dayjs(currentDate))) {
//               nextDate = nextDate.add(1, 'week');
//             }
//           }
//         } else {
//           nextDate = nextDate.add(1, 'week');
//         }
//         break;

//       case 'BI_WEEKLY':
//       case 'MONTHLY':
//         if (repeatOnDates && repeatOnDates.length > 0) {
//           const currentMonthDate = nextDate.date();
//           let nextMonthDate = -1;

//           for (const date of repeatOnDates) {
//             if (date > currentMonthDate) {
//               nextMonthDate = date;
//               break;
//             }
//           }

//           if (nextMonthDate !== -1) {
//             nextDate = nextDate.date(nextMonthDate);
//           } else {
//             nextDate = nextDate.add(1, 'month').date(repeatOnDates[0]);
//           }
//         } else {
//           nextDate = nextDate.add(repeatEvery === 'BI_WEEKLY' ? 2 : 1, 'month');
//         }
//         break;
//     }

//     if (remindBefore) {
//       nextDate = nextDate.subtract(remindBefore, 'day');
//     }

//     return nextDate.toDate();
//   }

//   @Cron('* * * * *') // runs every minute
//   async handleCron() {
//     this.logger.log('Scheduler running...');
//     const now = dayjs().toDate();

//     // 1. Fetch reminders that need to trigger now or earlier
//     const dueTasks = await this.prisma.reminder.findMany({
//       where: {
//         isActive: true,
//         nextTriggerAt: { lte: now },
//         project: {
//           status: 'LIVE',
//         },
//       },
//       include: {
//         project: {
//           include: {
//             projectEmployees: {
//               select: { employeeId: true },
//             },
//           },
//         },
//       },
//     });

//     if (!dueTasks.length) return;

//     // 2. For each task, send notifications to all employees + manager
//     for (const task of dueTasks) {
//       const employeeList = task.project.projectEmployees ?? [];

//       // Notify all employees in the project
//       for (const emp of employeeList) {
//         await this.notificationQueue.add('send', {
//           userId: emp.employeeId,
//           message: task.message,
//           projectId: task.projectId,
//         });
//       }

//       // Also notify the project manager
//       if (task.project.managerId) {
//         await this.notificationQueue.add('send', {
//           userId: task.project.managerId,
//           message: task.message,
//           projectId: task.projectId,
//         });
//       }

//       // 3. Reschedule the next trigger if repeatable
//       if (task.repeatEvery && task.nextTriggerAt) {
//         const nextDate = this.calculateNextTriggerAt(
//           task.repeatEvery,
//           task.nextTriggerAt,
//           task.repeatOnDays,
//           task.repeatOnDates,
//           task.remindBefore ?? undefined,
//         );

//         if (nextDate) {
//           await this.prisma.reminder.update({
//             where: { id: task.id },
//             data: { nextTriggerAt: nextDate },
//           });
//         }
//       }
//     }

//     this.logger.log(`Queued ${dueTasks.length} reminder tasks`);
//   }
// }





@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  calculateNextTriggerAt(
    repeatEvery: UploadCycle, 
    baseDate: Date,
    repeatOnDays?: DayOfWeek[],
    repeatOnDates?: number[],
    remindBefore?: number,
  ): Date {
    let nextDate = dayjs(baseDate);

    switch (repeatEvery) {
      case 'Daily':
        nextDate = nextDate.add(1, 'day');
        break;

      case 'Weekly':
        if (repeatOnDays && repeatOnDays.length > 0) {
          const dayMap: Record<DayOfWeek, number> = {
            SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, 
            THURSDAY: 4, FRIDAY: 5, SATURDAY: 6
          };

          const targetDays = repeatOnDays.map(d => dayMap[d]).sort();
          const currentDay = nextDate.day();
          let nextDay = targetDays.find(d => d > currentDay);
          if (nextDay === undefined) {
            nextDay = targetDays[0];
            nextDate = nextDate.add(1, 'week').day(nextDay);
          } else {
            nextDate = nextDate.day(nextDay);
          }
        } else {
          nextDate = nextDate.add(1, 'week');
        }
        break;

      case 'By_Weekly':
        nextDate = nextDate.add(2, 'week');
        break;

      case 'Monthly':
        if (repeatOnDates && repeatOnDates.length > 0) {
          const sortedDates = [...repeatOnDates].sort((a, b) => a - b);
          const currentDate = nextDate.date();
          let nextDayDate = sortedDates.find(d => d > currentDate);

          if (nextDayDate) {
            nextDate = nextDate.date(nextDayDate);
          } else {
            nextDate = nextDate.add(1, 'month').date(sortedDates[0]);
          }
        } else {
          nextDate = nextDate.add(1, 'month');
        }
        break;
    }

    if (remindBefore) {
      nextDate = nextDate.subtract(remindBefore, 'minute');
    }

    return nextDate.toDate();
  }

  @Cron('* * * * *')
  async handleCron() {
    const now = new Date();

    const dueTasks = await this.prisma.reminder.findMany({
      where: {
        isActive: true,
        nextTriggerAt: { lte: now },
        project: { 
            isDeleted: false,
            status: 'LIVE' 
        }, 
      },
      include: {
        project: {
          include: {
            projectEmployees: true,
          },
        },
      },
    });

    if (dueTasks.length === 0) return;

    for (const task of dueTasks) {
      const recipients = [
        ...task.project.projectEmployees.map(e => e.employeeId),
        task.project.managerId
      ].filter(Boolean);

      await Promise.all(recipients.map(userId => 
        this.notificationQueue.add('send', {
          userId,
          message: task.message,
          projectId: task.projectId,
        })
      ));

      if (task.repeatEvery) {
        const nextDate = this.calculateNextTriggerAt(
          task.repeatEvery,
          now,
          task.repeatOnDays,
          task.repeatOnDates,
          task.remindBefore ?? undefined,
        );

        await this.prisma.reminder.update({
          where: { id: task.id },
          data: { nextTriggerAt: nextDate },
        });
      } else {
        await this.prisma.reminder.update({
          where: { id: task.id },
          data: { isActive: false },
        });
      }
    }
    this.logger.log(`Processed ${dueTasks.length} reminders.`);
  }
}
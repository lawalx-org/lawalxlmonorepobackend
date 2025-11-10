import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulerService } from '../notification/scheduler.service';
import { CreateReminderDto, RepeatInterval } from '../project/dto/create-reminder.dto';
import { DayOfWeek } from '../../../generated/prisma';

@Injectable()
export class ReminderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerService: SchedulerService,
  ) {}

  async createReminder(createReminderDto: CreateReminderDto) {
    const {
      message,
      repeatEvery,
      isActive,
      projectId,
      repeatOnDays,
      repeatOnDates,
      remindBefore,
    } = createReminderDto;

    let nextTriggerAt: Date;

    if (repeatEvery === RepeatInterval.WEEKLY) {
      nextTriggerAt = this.schedulerService.calculateNextTriggerAt(
        repeatEvery,
        new Date(),
        repeatOnDays,
        undefined,
        remindBefore,
      );
    } else {
      nextTriggerAt = this.schedulerService.calculateNextTriggerAt(
        repeatEvery,
        new Date(),
        undefined,
        repeatOnDates,
        remindBefore,
      );
    }

    return this.prisma.reminder.create({
      data: {
        message,
        repeatEvery,
        isActive,
        projectId,
        nextTriggerAt,
        repeatOnDays: repeatOnDays as DayOfWeek[],
        repeatOnDates,
        remindBefore,
      },
    });
  }
}

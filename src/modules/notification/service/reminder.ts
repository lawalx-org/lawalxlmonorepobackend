import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchedulerService } from './scheduler.service';
import { CreateReminderDto } from '../dto/create-reminder.dto';
import { DayOfWeek, Prisma } from 'generated/prisma';

// @Injectable()
// export class ReminderService {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly schedulerService: SchedulerService,
//   ) {}

//   async createReminder(createReminderDto: CreateReminderDto) {
//     return this.createReminderWithTx(this.prisma, createReminderDto);
//   }

//   async createReminderWithTx(
//     tx: Prisma.TransactionClient,
//     createReminderDto: CreateReminderDto,
//   ) {
//     const {
//       message,
//       repeatEvery,
//       isActive,
//       projectId,
//       repeatOnDays,
//       repeatOnDates,
//       remindBefore,
//     } = createReminderDto;

//     let nextTriggerAt: Date;

//     if (repeatEvery === RepeatInterval.WEEKLY) {
//       nextTriggerAt = this.schedulerService.calculateNextTriggerAt(
//         repeatEvery,
//         new Date(),
//         repeatOnDays,
//         undefined,
//         remindBefore,
//       );
//     } else {
//       nextTriggerAt = this.schedulerService.calculateNextTriggerAt(
//         repeatEvery,
//         new Date(),
//         undefined,
//         repeatOnDates,
//         remindBefore,
//       );
//     }

//     return tx.reminder.create({
//       data: {
//         message,
//         repeatEvery,
//         isActive,
//         projectId,
//         nextTriggerAt,
//         repeatOnDays: repeatOnDays as DayOfWeek[],
//         repeatOnDates,
//         remindBefore,
//       },
//     });
//   }
// }

export class ReminderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly schedulerService: SchedulerService,
  ) {}

  async createReminder(createReminderDto: CreateReminderDto) {
    return this.prisma.$transaction(async (tx) => {
      if (!createReminderDto.projectId) {
        throw new BadRequestException('Project ID is required');
      }
      return this.createReminderWithTx(tx, createReminderDto as CreateReminderDto & { projectId: string });
    });
  }

  async createReminderWithTx(
    tx: Prisma.TransactionClient,
    dto: CreateReminderDto & { projectId: string }, 
  ) {
    const {
      message,
      uploadCycle,
      isActive,
      projectId,
      repeatOnDays,
      repeatOnDates,
      remindBefore,
    } = dto;

    const nextTriggerAt = this.schedulerService.calculateNextTriggerAt(
      uploadCycle as any,
      new Date(),
      repeatOnDays,
      repeatOnDates,
      remindBefore,
    );

    return tx.reminder.create({
      data: {
        message: message || 'Project Reminder Task',
        projectId: projectId, 
        nextTriggerAt,
        repeatEvery: uploadCycle as any, 
        isActive: isActive !== undefined ? isActive : true,
        repeatOnDays: (repeatOnDays as DayOfWeek[]) || [],
        repeatOnDates: repeatOnDates || [],
        remindBefore: remindBefore || 0,
      },
    });
  }
}
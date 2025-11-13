import {
  IsString,
  IsDate,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum RepeatInterval {
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  MONTHLY = 'MONTHLY',
}

export class CreateReminderDto {
  @ApiProperty({
    description: 'Reminder message or note',
    example: 'Weekly project status meeting',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Next scheduled trigger time (ISO date string)',
    example: '2025-11-15T10:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextTriggerAt?: Date;

  @ApiProperty({
    description: 'Repeat frequency of the reminder',
    enum: RepeatInterval,
    example: RepeatInterval.WEEKLY,
  })
  @IsEnum(RepeatInterval)
  repeatEvery: RepeatInterval;

  @ApiPropertyOptional({
    description:
      'Days of the week the reminder repeats (for weekly or bi-weekly)',
    example: ['MONDAY', 'FRIDAY'],
  })
  @IsArray()
  @IsOptional()
  repeatOnDays?: string[];

  @ApiPropertyOptional({
    description: 'Dates of the month for monthly reminders (1–31)',
    example: [1, 15, 30],
  })
  @IsArray()
  @IsOptional()
  repeatOnDates?: number[];

  @ApiPropertyOptional({
    description: 'Minutes before the event to send the reminder',
    example: 30,
  })
  @IsNumber()
  @IsOptional()
  remindBefore?: number;

  @ApiPropertyOptional({
    description: 'Whether the reminder is currently active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Associated project ID',
    example: 'c12d3f45-a678-90bc-def1-234567890abc',
  })
  @IsString()
  projectId: string;
}

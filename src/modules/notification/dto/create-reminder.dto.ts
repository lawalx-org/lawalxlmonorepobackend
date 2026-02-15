// import {
//  IsString,
//  IsDate,
//  IsEnum,
//  IsBoolean,
//  IsOptional,
//  IsArray,
//  IsNumber,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


// export enum RepeatInterval {
//  WEEKLY = 'WEEKLY',
//  BI_WEEKLY = 'BI_WEEKLY',
//  MONTHLY = 'MONTHLY',
// }


// export class CreateReminderDto {
//  @ApiProperty({
//    description: 'Reminder message or note',
//    example: 'Weekly project status meeting',
//  })
//  @IsString()
//  message: string;


//  @ApiProperty({
//    description: 'Repeat frequency of the reminder',
//    enum: RepeatInterval,
//    example: RepeatInterval.WEEKLY,
//  })
//  @IsEnum(RepeatInterval)
//  repeatEvery: RepeatInterval;


//  @ApiPropertyOptional({
//    description:
//      'Days of the week the reminder repeats (for weekly or bi-weekly)',
//    example: ['MONDAY', 'FRIDAY'],
//  })
//  @IsArray()
//  @IsOptional()
//  repeatOnDays?: string[];
// @ApiPropertyOptional({
//    description: 'Dates of the month for monthly reminders (1–31)',
//    example: [1, 15, 30],
//  })
//  @IsArray()
//  @IsOptional()
//  repeatOnDates?: number[];


//  @ApiPropertyOptional({
//    description: 'Minutes before the event to send the reminder',
//    example: 30,
//  })
//  @IsNumber()
//  @IsOptional()
//  remindBefore?: number;


//  @ApiPropertyOptional({
//    description: 'Whether the reminder is currently active',
//    example: true,
//  })
//  @IsBoolean()
//  @IsOptional()
//  isActive?: boolean;


//  @IsString()
//  projectId: string;
// }












// export class CreateReminderProjectDto {
//  @ApiProperty({
//    description: 'Reminder message or note',
//    example: 'Weekly project status meeting',
//  })
//  @IsString()
//  message: string;


//  @ApiProperty({
//    description: 'Repeat frequency of the reminder',
//    enum: RepeatInterval,
//    example: RepeatInterval.WEEKLY,
//  })
//  @IsEnum(RepeatInterval)
//  repeatEvery: RepeatInterval;


//  @ApiPropertyOptional({
//    description:
//      'Days of the week the reminder repeats (for weekly or bi-weekly)',
//    example: ['MONDAY', 'FRIDAY'],
//  })
//  @IsArray()
//  @IsOptional()
//  repeatOnDays?: string[];


//  @ApiPropertyOptional({
//    description: 'Dates of the month for monthly reminders (1–31)',
//    example: [1, 15, 30],
//  })
//  @IsArray()
//  @IsOptional()
//  repeatOnDates?: number[];


//  @ApiPropertyOptional({
//    description: 'Minutes before the event to send the reminder',
//    example: 30,
//  })
//  @IsNumber()
//  @IsOptional()
//  remindBefore?: number;


//  @ApiPropertyOptional({
//    description: 'Whether the reminder is currently active',
//    example: true,
//  })
//  @IsBoolean()
// @IsOptional()
//  isActive?: boolean;


// }

import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UploadCycle, DayOfWeek } from 'generated/prisma'; 

export class CreateReminderDto {
  @ApiPropertyOptional({ example: 'Weekly status update' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ enum: UploadCycle })
  @IsEnum(UploadCycle)
  @IsOptional()
  uploadCycle?: UploadCycle;

  @ApiPropertyOptional({ enum: DayOfWeek, isArray: true })
  @IsArray()
  @IsOptional()
  repeatOnDays?: DayOfWeek[];

  @ApiPropertyOptional({ example: [1, 15], type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(31, { each: true })
  @IsOptional()
  repeatOnDates?: number[];

  @ApiPropertyOptional({ example: 30 })
  @IsNumber()
  @IsOptional()
  remindBefore?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsUUID()
  @IsOptional() 
  projectId?: string;
}
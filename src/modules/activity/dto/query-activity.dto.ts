import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsUUID,
  ValidateIf,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';

export enum DateRangePreset {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last7days',
  LAST_30_DAYS = 'last30days',
  THIS_MONTH = 'thisMonth',
  LAST_MONTH = 'lastMonth',
  LAST_WEEK = 'lastWeek',
}

@ValidatorConstraint({ name: 'IsDateAfter', async: false })
export class IsDateAfterConstraint implements ValidatorConstraintInterface {
  validate(endDate: string, args: ValidationArguments) {
    const object = args.object as any;
    const startDate = object[args.constraints[0]];

    if (!startDate || !endDate) return true;

    return new Date(endDate) >= new Date(startDate);
  }

  defaultMessage(args: ValidationArguments) {
    return `End date must be after or equal to ${args.constraints[0]}`;
  }
}

export class QueryActivityDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'Invalid user ID format' })
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'Invalid project ID format' })
  projectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: DateRangePreset,
    description: 'Preset date ranges',
  })
  @IsOptional()
  @IsEnum(DateRangePreset, { message: 'Invalid date range preset' })
  dateRange?: DateRangePreset;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid start date format' })
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid end date format' })
  @ValidateIf((o) => o.startDate && o.endDate)
  @Validate(IsDateAfterConstraint, ['startDate'])
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Include IP address in response',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeIp?: boolean;
}

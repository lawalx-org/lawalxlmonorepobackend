import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, IsInt, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';
import { Type } from 'class-transformer';

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
}

export class GetAllProgramsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by program name',
  })
  @IsOptional()
  @IsString()
  programName?: string;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    enum: Priority,
    example: Priority.HIGH,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Filter by deadline (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({
    description: 'Filter by progress',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  progress?: number;

  @ApiPropertyOptional({
    description: 'Filter by datetime (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  datetime?: string;
}

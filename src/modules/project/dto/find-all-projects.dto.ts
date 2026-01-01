import { IsOptional, IsInt, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProjectStatus, Priority } from 'generated/prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';

export enum ProjectSortBy {
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindAllProjectsDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: ProjectStatus,
    description: 'Filter by project status',
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({
    enum: Priority,
    description: 'Filter by project priority',
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Filter by manager ID' })
  @IsOptional()
  @IsString()
  managerId?: string;

  @ApiPropertyOptional({ description: 'Filter by program ID' })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiPropertyOptional({
    description: 'Filter by project name (case-insensitive search)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by start date (ISO 8601 format)',
  })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by end date (ISO 8601 format)' })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Filter by project progress' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  progress?: number;

  @ApiPropertyOptional({ description: 'Filter by employee ID' })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiPropertyOptional({ description: 'Filter by viewer ID' })
  @IsOptional()
  @IsString()
  viewerId?: string;


   // ✅ SORTING (single DTO)
  @ApiPropertyOptional({
    enum: ProjectSortBy,
    description: 'Sort by start date or end date',
  })
  @IsOptional()
  @IsEnum(ProjectSortBy)
  sortBy?: ProjectSortBy;

  @ApiPropertyOptional({
    enum: SortOrder,
    description: 'Sort order (asc or desc)',
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}

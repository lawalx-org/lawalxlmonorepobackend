import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { TaskStatus, Priority } from 'generated/prisma';

export class EmployeeTaskFilterDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'task name',
    description: 'Search by task name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    description: 'Filter by task status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: Priority, description: 'Filter by priority' })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    example: 'project-id',
    description: 'Filter by project',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Filter from due date',
  })
  @IsOptional()
  @IsString()
  dueDateFrom?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Filter to due date',
  })
  @IsOptional()
  @IsString()
  dueDateTo?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'Minimum progress percentage',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressMin?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Maximum progress percentage',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  progressMax?: number;

  @ApiPropertyOptional({
    example: 'dueDate',
    description: 'Sort by field',
    enum: ['name', 'dueDate', 'priority', 'progress', 'status', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'desc',
    description: 'Sort order',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

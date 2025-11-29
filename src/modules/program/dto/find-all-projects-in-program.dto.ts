import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';
import { Priority } from './get-all-programs.dto';

export class FindAllProjectsInProgramDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by project name or description',
    example: 'super cool project',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by priority',
    example: 'HIGH',
    enum: Priority,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Filter by deadline',
    example: '2025-12-31',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  deadline?: Date;

  @ApiPropertyOptional({
    description: 'Filter by start date',
    example: '2025-01-01',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate?: Date;
}

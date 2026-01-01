import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';
import { Type, Transform } from 'class-transformer';

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

  @ApiPropertyOptional({
    description: 'Filter by tags',
    example: 'frontend,backend',
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => (value ? value.split(',') : undefined))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
  @ApiPropertyOptional({
    description: 'Filter by latitude',
    example: 23.810332,
    minimum: -90,
    maximum: 90,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Filter by longitude',
    example: 90.412518,
    minimum: -180,
    maximum: 180,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Search radius in kilometers (used with latitude & longitude)',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  radiusKm?: number;
}

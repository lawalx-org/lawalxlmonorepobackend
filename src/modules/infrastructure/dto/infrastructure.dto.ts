import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsDateString,
  IsUUID,
  IsObject,
  IsNumber,
  isNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Priority } from '../contants';
export class InfrastructureProjectDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({
    description: 'The name of the task or project',
    type: String,
  })
  @IsString()
  taskName: string;

  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'Duration in days of the project',
    type: Number,
  })
  @IsInt()
  duration: number;

  @ApiProperty({
    description: 'The start date of the project',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'The finish date of the project',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  finishDate: Date;

  @ApiProperty({
    description: 'List of assigned users ID to the project',
    type: [String],
    required: false,
    example: ['UserId1', 'userId2'],
  })
  @IsArray()
  @Type(() => IsUUID)
  @IsOptional()
  assigned?: string[];

  @ApiProperty({
    description: 'Calculated progress of the project',
    type: Number,
  })
  @IsNumber()
  computedProgress: number;

  @ApiProperty({
    description: 'Priority of the task',
    example: 'NONE',
  })
  @IsString()
  priority: Priority;

  @ApiProperty({
    description: 'Actual hours spent on the project',
    type: Number,
  })
  @IsNumber()
  actualHour: number;

  @ApiProperty({
    description: 'Planned hours for the project',
    type: Number,
  })
  @IsNumber()
  plannedHour: number;

  @ApiProperty({
    description: 'Planned cost for the project',
    type: Number,
  })
  @IsNumber()
  plannedCost: number;

  @ApiProperty({
    description: 'Planned resource cost for the project',
    type: Number,
  })
  @IsNumber()
  plannedResourceCost: number;

  @ApiProperty({
    description: 'Additional metadata information for the project',
    type: Object,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata: Record<string, any>;

  @IsDateString()
  @IsOptional()
  createdAt?: Date;

  @IsDateString()
  @IsOptional()
  updatedAt?: Date;
}
export class UpdateInfrastructureProjectDto extends PartialType(
  InfrastructureProjectDto,
) {}

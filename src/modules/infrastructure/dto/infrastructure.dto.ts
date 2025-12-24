import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsArray,
  IsOptional,
  IsDateString,
  IsUUID,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InfrastructureNodeDto } from './infrastructure.node.dto'; // Assuming you have a node DTO
import { BaseUserDto } from 'src/modules/user/dto/base-user.dto';
import { Priority, priority } from '../contants';
export class InfrastructureProjectDto {
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The name of the task or project',
    type: String,
  })
  @IsString()
  taskName: string;

  @IsString()
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
  @IsString()
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
  @IsString()
  actualHour: number;

  @ApiProperty({
    description: 'Planned hours for the project',
    type: Number,
  })
  @IsString()
  plannedHour: number;

  @ApiProperty({
    description: 'Planned cost for the project',
    type: Number,
  })
  @IsString()
  plannedCost: number;

  @ApiProperty({
    description: 'Planned resource cost for the project',
    type: Number,
  })
  @IsString()
  plannedResourceCost: number;

  @ApiProperty({
    description: 'Additional metadata information for the project',
    type: Object,
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata: Record<string, any>;

  // @ApiProperty({
  //   description: 'List of associated infrastructure nodes',
  //   type: [InfrastructureNodeDto],
  // })
  // @IsArray()
  // @Type(() => InfrastructureNodeDto)
  // nodes: InfrastructureNodeDto[];

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

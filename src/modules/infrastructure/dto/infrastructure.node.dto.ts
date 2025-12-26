import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsInt,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';
import { Priority } from '../contants';

export class InfrastructureNodeDto {
  @ApiProperty({
    description: 'Project ID this node belongs to',
    example: '0699c9bd-dc72-437e-b4cd-f40844ef5579',
  })
  @IsUUID()
  projectId: string;

  @ApiPropertyOptional({
    description: 'Parent node ID (null for top-level nodes)',
    example: 'c1d2e3f4-a5b6-7890-abcd-112233445566',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @ApiProperty({
    description: 'Task name of the node',
    example: 'Foundation Work',
  })
  @IsString()
  taskName: string;

  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'Task duration (days)',
    example: 10,
    default: 0,
  })
  @IsInt()
  @Min(0)
  duration: number;

  @ApiProperty({
    description: 'Start date of the task',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: 'Finish date of the task',
    example: '2025-01-10T00:00:00.000Z',
  })
  @IsDateString()
  finishDate: Date;

  @ApiProperty({
    description: 'Priority of the task',
    example: 'NONE',
  })
  @IsString()
  priority: Priority;

  @ApiProperty({
    description: 'Actual hours spent',
    example: 12.5,
    default: 0,
  })
  @IsNumber()
  actualHour: number;

  @ApiProperty({
    description: 'Planned hours',
    example: 15,
    default: 0,
  })
  @IsNumber()
  plannedHour: number;

  @ApiProperty({
    description: 'Planned cost',
    example: 25000,
    default: 0,
  })
  @IsNumber()
  plannedCost: number;

  @ApiProperty({
    description: 'Planned resource cost',
    example: 12000,
    default: 0,
  })
  @IsNumber()
  plannedResourceCost: number;

  @ApiPropertyOptional({
    description: 'Progress value (only for leaf nodes)',
    example: 0.6,
  })
  @IsOptional()
  @IsNumber()
  progress?: number | null;

  @ApiProperty({
    description: 'Computed progress (auto-calculated)',
    example: 0.45,
    default: 0,
  })
  @IsNumber()
  computedProgress: number;

  @ApiProperty({
    description: 'Weight of the node in progress calculation',
    example: 1,
    default: 1,
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    description: 'Indicates whether the node is a leaf',
    example: true,
    default: true,
  })
  @IsBoolean()
  isLeaf: boolean;
}

export class UpdateInfrastructureNodeDto extends PartialType(
  InfrastructureNodeDto,
) {}

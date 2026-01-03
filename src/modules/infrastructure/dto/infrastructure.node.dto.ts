import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class InfrastructureNodeDto {
  @ApiProperty({
    description: 'The unique identifier for the project',
    type: String,
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'The unique identifier for the program',
    type: String,
  })
  @IsString()
  programId: string;

  @ApiProperty({
    description: 'The chart ID related to the node',
    type: String,
  })
  @IsString()
  nodeChartId: string;

  @ApiProperty({ description: 'The task name for this node', type: String })
  @IsString()
  taskName: string;

  @ApiProperty({
    description: 'Parent node ID, optional',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: 'The weight of the task',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'Priority of the task',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiProperty({
    description: 'Chart values for leaf nodes',
    type: Object,
    required: false,
  })
  @IsObject()
  @IsOptional()
  chartValues?: Record<string, number>;
}

export class UpdateInfrastructureNodeDto {
  @ApiProperty({
    description: 'Updated task name, optional',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  taskName?: string;

  @ApiProperty({
    description: 'Updated parent node ID, optional',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: 'Progress of the task, optional',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiProperty({
    description: 'Updated weight of the task, optional',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'Updated chart values for the node, optional',
    type: Object,
    required: false,
  })
  @IsObject()
  @IsOptional()
  chartValues?: Record<string, number>;

  @ApiProperty({
    description: 'Duration of the task, optional',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({
    description: 'Actual hours spent on the task, optional',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  actualHour?: number;

  @ApiProperty({
    description: 'Planned hours for the task, optional',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  plannedHour?: number;

  @ApiProperty({
    description: 'Planned cost for the task, optional',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  plannedCost?: number;

  @ApiProperty({
    description: 'Planned resource cost, optional',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  plannedResourceCost?: number;
}

// Bulk import DTO
export class NodeImportItem {
  @ApiProperty({
    description: 'Node ID to update an existing node',
    type: String,
  })
  @IsString()
  nodeId: string;

  @ApiProperty({ description: 'Chart values for the node', type: Object })
  @IsObject()
  chartValues: Record<string, number>;
}
export class BulkNodeImportDto {
  @ApiProperty({ description: 'The project ID', type: String })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'The list of nodes to be imported',
    type: [NodeImportItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NodeImportItem)
  nodes: NodeImportItem[];
}

// Bulk Create Tree DTO

export class TreeNodeDto {
  @ApiProperty({ description: 'Task name for the tree node', type: String })
  @IsString()
  taskName: string;

  @ApiProperty({
    description: 'The weight of the task',
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    description: 'Priority of the task',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  priority?: string;

  @ApiProperty({
    description: 'Children nodes in the tree',
    type: [TreeNodeDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TreeNodeDto)
  @IsOptional()
  children?: TreeNodeDto[];
}

export class BulkCreateTreeDto {
  @ApiProperty({ description: 'The project ID', type: String })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'The program ID', type: String })
  @IsString()
  programId: string;

  @ApiProperty({ description: 'The chart ID (blueprint)', type: String })
  @IsString()
  chartId: string;

  @ApiProperty({
    description: 'The nodes to be created in bulk',
    type: [TreeNodeDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TreeNodeDto)
  nodes: TreeNodeDto[];
}

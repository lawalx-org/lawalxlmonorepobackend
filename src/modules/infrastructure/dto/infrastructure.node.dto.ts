import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { InfrastructureDto } from './infrastructure.dto';

export class InfrastructureNodeDto {
  @ApiProperty({ description: 'Name of the node' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'ID of the infrastructure project this node belongs to',
  })
  @IsUUID()
  infrastructureProjectId: string;

  @ApiPropertyOptional({
    description: 'Parent node ID if this is a child node',
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Progress value (only for leaf nodes)' })
  @IsNumber()
  @IsOptional()
  progress?: number;

  @ApiPropertyOptional({ description: 'Weight for the node' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Indicates if this node is a leaf node' })
  @IsBoolean()
  @IsOptional()
  isLeaf?: boolean;
}

export class UpdateInfrastructureNodeDto extends PartialType(
  InfrastructureDto,
) {}

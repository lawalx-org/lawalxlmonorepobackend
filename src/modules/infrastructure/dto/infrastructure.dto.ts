import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class InfrastructureDto {
  @ApiProperty({ description: 'Name of the project' })
  @IsString()
  name: string;

  @ApiHideProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Project computed progress' })
  @IsNumber()
  computedProgress: number;
}

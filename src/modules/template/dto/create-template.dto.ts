import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'Invoice Template',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Owner user id',
    example: 'user-uuid-123',
  })
  @IsString()
  ownerid: string;

  @ApiPropertyOptional({
    description: 'List of chart ids',
    example: ['chart-uuid-1', 'chart-uuid-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chartList?: string[];
}




export class CreateProgrammbuilderTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'Dashboard Template',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Owner user id',
    example: 'user-uuid-123',
  })
  @IsString()
  ownerid: string;

  @ApiProperty({
    description: 'Chart id',
    example: 'chart-uuid-456',
  })
  @IsString()
  charid: string;
}

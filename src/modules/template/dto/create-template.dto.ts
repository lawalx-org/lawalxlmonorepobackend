import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTemplateDto {
  @ApiPropertyOptional({
    description: 'Template name',
    example: 'Invoice Template',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

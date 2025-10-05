import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class CreateManagerDto extends BaseUserDto {
 

  @ApiPropertyOptional({ type: [String], example: ['skill1', 'skill2'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];
}

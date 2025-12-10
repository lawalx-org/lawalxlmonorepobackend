import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class RequestSheetUpdateDto {
  @ApiPropertyOptional({ description: 'Its optional' })
  @IsOptional()
  @IsUUID()    
  projectId?: string;
}

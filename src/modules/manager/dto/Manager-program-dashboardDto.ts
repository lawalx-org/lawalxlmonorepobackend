import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Priority } from 'generated/prisma';

export class ProgramDashboardQueryDto {
  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Search project by name or description' })
  @IsOptional()
  @IsString()
  search?: string;
}

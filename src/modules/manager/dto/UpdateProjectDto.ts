import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Priority, ProjectStatus } from 'generated/prisma';

export class UpdateProjectDto {
  @ApiPropertyOptional({
    example: 'ERP System Upgrade',
    description: 'Project name',
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  name?: string;

  @ApiPropertyOptional({
    enum: ProjectStatus,
    example: ProjectStatus.LIVE,
    description: 'Project status',
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({
    enum: Priority,
    example: Priority.HIGH,
    description: 'Project priority',
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}

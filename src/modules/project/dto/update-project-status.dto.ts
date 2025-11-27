
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ProjectStatus {
  PENDING = 'PENDING',
  LIVE = 'LIVE',
  DRAFT = 'DRAFT',
  OVERDUE = 'OVERDUE',
  PROBLEM = 'PROBLEM',
  COMPLETED = 'COMPLETED',
}

export class UpdateProjectStatusDto {
  @ApiProperty({
    enum: ProjectStatus,
    description: 'The new status of the project.',
  })
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}

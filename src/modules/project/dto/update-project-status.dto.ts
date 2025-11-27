
import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateProjectStatusDto {
  @ApiProperty({
    enum: ProjectStatus,
    description: 'The new status of the project.',
  })
  @IsNotEmpty()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;
}

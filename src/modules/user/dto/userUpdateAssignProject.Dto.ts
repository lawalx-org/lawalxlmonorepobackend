import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReplaceUserProjectDto {
  @ApiProperty({ description: 'Old project ID to replace' })
  @IsString()
  oldProjectId: string;

  @ApiProperty({ description: 'New project ID to assign' })
  @IsString()
  newProjectId: string;

  @ApiProperty({ description: 'User ID to update project for' })
  @IsString()
  userId: string;
}

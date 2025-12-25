import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class CreateViewerDto extends BaseUserDto {
  @ApiProperty({
    example: ['project-id-1', 'project-id-2'],
    description: 'Array of project IDs associated with the viewer',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  projectId: string[];
}

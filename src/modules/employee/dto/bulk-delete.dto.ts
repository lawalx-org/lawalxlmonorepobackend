import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class BulkDeleteDto {
  @ApiProperty({
    type: [String],
    example: ['id1', 'id2', 'id3'],
    description: 'Array of employee IDs to delete',
  })
  @IsArray()
  @IsString({ each: true })
  employeeIds: string[];
}

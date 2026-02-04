import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SyncTagsDto {
  @ApiProperty({
    description: 'An array of tag names to associate with the program',
    example: ['id1', 'Phase 1 id2', 'Internal id-3'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
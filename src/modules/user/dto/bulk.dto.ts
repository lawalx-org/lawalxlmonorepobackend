import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUsersDto {
  @ApiProperty({
    description: 'An array of unique user IDs to be deleted',
    example: ['uuid-123', 'uuid-456'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids: string[];
}
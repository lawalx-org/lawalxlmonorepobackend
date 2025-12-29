import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FavoriteProjectDto {
  @ApiProperty({
    example: 'f2b1a8c4-7e90-4a4d-9f92-abc123456789',
  })
  @IsUUID()
  projectId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'program-id-123' })
  @IsString()
  programId: string;

  @ApiProperty({ example: 'Important' })
  @IsString()
  name: string;
}

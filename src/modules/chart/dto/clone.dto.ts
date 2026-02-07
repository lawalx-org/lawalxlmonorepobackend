import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloneSingleChartDto {
  @ApiProperty({
    description: 'UUID of the chart',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4')
  id: string;
}

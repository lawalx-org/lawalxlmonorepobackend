import { IsNumberString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSubmissionStatusQueryDto {
  
  @ApiPropertyOptional({
    example: '12',
    description: 'Month number (1–12)',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Month must be a number' })
  month?: string;

  @ApiPropertyOptional({
    example: '2025',
    description: 'Year in YYYY format',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Year must be a number' })
  year?: string;
}

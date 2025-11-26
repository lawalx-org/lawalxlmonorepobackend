import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';
import { SubmittedStatus } from '../../../../generated/prisma';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';

export class GetAllSubmissionsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by project name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: SubmittedStatus,
  })
  @IsOptional()
  @IsString()
  status?: SubmittedStatus;

  @ApiPropertyOptional({
    description: 'Filter by start date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by end date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

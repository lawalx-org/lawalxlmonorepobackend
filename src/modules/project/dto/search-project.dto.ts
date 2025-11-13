import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/utils/pagination/pagination.dto';

export class SearchProjectByNameDto extends PaginationDto {
  @ApiProperty({ description: 'Search query for project name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Filter by employee ID' })
  @IsOptional()
  @IsString()
  employeeId?: string;
}

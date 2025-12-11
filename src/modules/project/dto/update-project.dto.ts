import { ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsNumber, 
  IsDateString, 
  IsArray 
} from 'class-validator';
import { Priority, ProjectStatus } from 'generated/prisma';

export class UpdateProjectDto {

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  projectCompleteDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  progress?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentRate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  chartList?: string[];


  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  managerId?: string; 

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  addEmployeeIds?: string[]; 

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  removeEmployeeIds?: string[]; 
}

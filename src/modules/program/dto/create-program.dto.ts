import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsISO8601,
} from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({
    example: 'New Website Development',
    description: 'The name of the program',
  })
  @IsString()
  @IsNotEmpty()
  programName: string;

  @ApiProperty({
    example: '2025-10-12T05:19:26.155Z',
    description: 'The date and time of the program in ISO 8601 format',
  })
  @IsISO8601()
  @IsNotEmpty()
  datetime: string;

  @ApiProperty({
    example: 'This program is for developing a new company website.',
    description: 'A description of the program',
  })
  @IsString()
  @IsNotEmpty()
  programDescription: string;

  @ApiProperty({
    example: 'High',
    description: 'The priority of the program',
  })
  @IsString()
  @IsNotEmpty()
  priority: string;

  @ApiProperty({
    example: '2026-10-12T05:19:26.155Z',
    description: 'The deadline for the program in ISO 8601 format',
  })
  @IsISO8601()
  @IsNotEmpty()
  deadline: string;

  @ApiProperty({
    example: 50,
    description: 'The progress of the program in percentage',
    required: false,
  })
  @IsInt()
  @IsOptional()
  progress?: number;
}

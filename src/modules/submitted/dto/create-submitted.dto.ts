import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateSubmittedDto {
  @ApiProperty({
    example: 'This is the information',
    description: 'The information about the submission',
  })
  @IsString()
  @IsNotEmpty()
  information: string;

  @ApiProperty({
    example: 'This is the submission',
    description: 'The submission content',
  })
  @IsString()
  @IsNotEmpty()
  submission: string;

  @ApiProperty({
    example: 'project-id',
    description: 'The ID of the project',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    example: 'sheet-id',
    description: 'The ID of the sheet',
  })
  @IsString()
  @IsNotEmpty()
  sheetId: string;

  @ApiProperty({
    example: ['cell-id-1', 'cell-id-2'],
    description: 'An array of submitted cell IDs',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  submiteCells: string[];
}

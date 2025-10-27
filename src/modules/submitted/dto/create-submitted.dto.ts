import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

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
    example: 'employee-id',
    description: 'The ID of the employee',
  })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

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
}

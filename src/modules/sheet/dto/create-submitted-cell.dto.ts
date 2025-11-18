import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubmittedCellDto {
  @ApiProperty({ description: 'Row number' })
  @IsInt()
  row: number;

  @ApiProperty({ description: 'Column number' })
  @IsInt()
  col: number;

  @ApiProperty({ description: 'Value of the cell' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Sheet ID' })
  @IsUUID()
  sheetId: string;

 
}

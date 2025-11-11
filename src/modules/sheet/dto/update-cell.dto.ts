import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCellDto {
  @ApiProperty({
    description: 'Row index of the cell in the sheet',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  row: number;

  @ApiProperty({
    description: 'Column index of the cell in the sheet',
    example: 2,
  })
  @IsNotEmpty()
  @IsInt()
  col: number;

  @ApiProperty({
    description: 'Value stored in the cell',
    example: 'Hello World',
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: 'Unique identifier of the sheet this cell belongs to',
    example: 'sheet_12345abc',
  })
  @IsNotEmpty()
  @IsString()
  sheetId: string;


  
}

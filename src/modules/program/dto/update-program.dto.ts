import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgramNameDto {
  @ApiProperty({
    description: 'The new name of the program',
    example: 'New Marketing Strategy Program',
  })
  @IsString()
  @IsNotEmpty()
  programName: string;
}

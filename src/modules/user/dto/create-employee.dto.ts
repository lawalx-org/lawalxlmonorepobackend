import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseUserDto } from './base-user.dto';

export class CreateEmployeeDto extends BaseUserDto {
  // @ApiProperty({ example: 'your-client-id' })
  // @IsString()
  // clientId: string;
}

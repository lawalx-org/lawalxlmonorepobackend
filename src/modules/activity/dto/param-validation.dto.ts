import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UuidParamDto {
  @ApiProperty({ description: 'Activity UUID' })
  @IsUUID('4', { message: 'Invalid activity ID format' })
  id: string;
}

export class UserIdParamDto {
  @ApiProperty({ description: 'User UUID' })
  @IsUUID('4', { message: 'Invalid user ID format' })
  userId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'An array of user IDs who will receive the notification.',
    example: ['user-id-3', 'user-id-4'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  receiverIds: string[];

  @ApiProperty({
    description: 'The main content or message of the notification.',
    example: 'You have a new task assigned.',
  })
  @IsString()
  @IsNotEmpty()
  context: string;

  @ApiProperty({
    description: 'The type of the notification.',
    example: 'TASK_ASSIGNED',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

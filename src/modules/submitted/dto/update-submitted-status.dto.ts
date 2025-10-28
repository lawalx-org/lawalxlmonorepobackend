import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SubmittedStatus } from '../../../../generated/prisma';

export class UpdateSubmittedStatusDto {
  @ApiProperty({
    example: SubmittedStatus.APPROVED,
    description: 'The new status of the submission',
    enum: SubmittedStatus,
  })
  @IsEnum(SubmittedStatus)
  status: SubmittedStatus;
}

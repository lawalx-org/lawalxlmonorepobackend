import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SubmittedStatus } from 'generated/prisma';


export class UpdateSubmissionStatusDto {
  @ApiProperty({
    description: 'New status of the submission',
    enum: SubmittedStatus,
    example: SubmittedStatus.APPROVED,
  })
  @IsEnum(SubmittedStatus)
  status: SubmittedStatus;
}

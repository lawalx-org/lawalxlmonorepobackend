import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SubmittedStatus } from 'generated/prisma';

export class UpdateSubmittedStatusDto {
  @ApiProperty({
    enum: SubmittedStatus,
    example: SubmittedStatus.APPROVED,
  })
  @IsEnum(SubmittedStatus)
  status: SubmittedStatus;
}

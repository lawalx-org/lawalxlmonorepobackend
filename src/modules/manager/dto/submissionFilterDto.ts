import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { SubmittedStatus } from "generated/prisma";

export class SubmissionFilterDto {
  @IsOptional()
  @IsEnum(SubmittedStatus)
  status?: SubmittedStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}

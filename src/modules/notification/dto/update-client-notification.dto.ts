// import { IsBoolean, IsOptional } from 'class-validator';

// export class UpdateClientNotificationDto {
//   @IsOptional()
//   @IsBoolean()
//   onProjectApproval?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   onProjectRejection?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   fileImportByEmployees?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   weeklySummary?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   storageLimit?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   billPayment?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   overdueProject?: boolean;
// }
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientNotificationDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  onProjectApproval?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  onProjectRejection?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  fileImportByEmployees?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  weeklySummary?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  storageLimit?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  billPayment?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  overdueProject?: boolean;
}

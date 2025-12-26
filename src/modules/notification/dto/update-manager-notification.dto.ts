// import { IsBoolean, IsOptional } from 'class-validator';

// export class UpdateManagerNotificationDto {
//   @IsOptional()
//   @IsBoolean()
//   fileImportByEmployees?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   weeklySummary?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   createNewProject?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   submittedProject?: boolean;
// }
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateManagerNotificationDto {
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
  createNewProject?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  submittedProject?: boolean;
}

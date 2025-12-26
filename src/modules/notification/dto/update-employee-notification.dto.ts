// import { IsBoolean, IsOptional } from 'class-validator';

// export class UpdateEmployeeNotificationDto {
//   @IsOptional()
//   @IsBoolean()
//   returnProject?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   assignNewProject?: boolean;

//   @IsOptional()
//   @IsBoolean()
//   projectPublish?: boolean;
// }

import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmployeeNotificationDto {
  @ApiPropertyOptional({
    example: false,
    description: 'Notify when project is returned',
  })
  @IsOptional()
  @IsBoolean()
  returnProject?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Notify when a new project is assigned',
  })
  @IsOptional()
  @IsBoolean()
  assignNewProject?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Notify when project is published',
  })
  @IsOptional()
  @IsBoolean()
  projectPublish?: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { ActivityActionType } from 'generated/prisma';
import { JsonValue } from '@prisma/client/runtime/library';

export class ActivityUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  role?: string;
}

export class ActivityItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty({ required: false })
  user?: ActivityUserDto;

  @ApiProperty()
  description: string;

  @ApiProperty()
  projectName: string;

  @ApiProperty({ required: false })
  ipAddress?: string;

  @ApiProperty({ enum: ActivityActionType })
  actionType: ActivityActionType;

  @ApiProperty({ required: false })
  metadata?: JsonValue;
}

export class ActivityMetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty({ required: false })
  user?: ActivityUserDto;
}

export class ActivityResponseDto {
  @ApiProperty({ type: [ActivityItemDto] })
  data: ActivityItemDto[];

  @ApiProperty({ type: ActivityMetaDto })
  meta: ActivityMetaDto;
}

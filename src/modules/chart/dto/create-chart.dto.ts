import { IsString, IsEnum, IsOptional, IsJSON, IsUUID } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ChartName, ChartStatus } from 'generated/prisma';
import { CreateBarChartDto } from './barchartDto';
import { Create_Hr_BarChartDto } from './hr_bar_chartDto';
import { Create_Pi_ChartDto } from './pi_ChartDto';
// import { HeatMap_ChartDto } from './heatMap_chartDto';

export class CreateChartDto extends IntersectionType(
  CreateBarChartDto,
  Create_Hr_BarChartDto,
  Create_Pi_ChartDto,
  // HeatMap_ChartDto,
) {
  @ApiProperty({
    example: 'Weekly Sleep Pattern',
    description: 'Title of the chart.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: ChartStatus.INACTIVE,
    enum: ChartStatus,
  })
  @IsEnum(ChartStatus)
  status: ChartStatus;

  @ApiProperty({
    example: ChartName.BAR,
    enum: ChartName,
  })
  @IsEnum(ChartName)
  category: ChartName;

  @ApiProperty({
    example: '{\"labels\":[[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]}',
  })
  @IsJSON()
  xAxis: string;

  @ApiProperty({
    example: '{\"labels\":[[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]}',
  })
  @IsOptional()
  @IsJSON()
  yAxis?: string;

  @ApiProperty({
    example: '{\"labels\":[[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]}',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  zAxis?: string;

  @ApiProperty({
    example: 'project uuid',
  })
  @IsUUID()
  @IsOptional()
  projectId?: string;
}

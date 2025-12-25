import { IsString, IsEnum, IsOptional, IsJSON } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ChartName, ChartStatus } from 'generated/prisma';
import { CreateBarChartDto } from './barchartDto';
import { Create_Hr_BarChartDto } from './hr_bar_chartDto';
import { Create_Pi_ChartDto } from './pi_ChartDto';
import { HeatMap_ChartDto } from './heatMap_chartDto';

export class CreateChartDto extends IntersectionType(
  CreateBarChartDto,
  Create_Hr_BarChartDto,
  Create_Pi_ChartDto,
  HeatMap_ChartDto
) {
  @ApiProperty({
    example: 'Weekly Sleep Pattern',
    description: 'Title of the chart.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: ChartStatus.ACTIVE,
    enum: ChartStatus,
  })
  @IsEnum(ChartStatus)
  status: ChartStatus;

  @ApiProperty({
    example: ChartName.AREA,
    enum: ChartName,
  })
  @IsEnum(ChartName)
  category: ChartName;

  @ApiProperty({
    example: '{"labels":["Mon","Tue","Wed"],"values":[6,7,8]}',
  })
  @IsJSON()
  xAxis: string;

  @ApiProperty({
    example: '{"labels":["Mon","Tue","Wed"],"values":[70,80,90]}',
  })
  @IsOptional()
  @IsJSON()
  yAxis?: string;

  @ApiProperty({
    example: '{"labels":["Mon","Tue","Wed"],"values":[1,2,3]}',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  zAxis?: string;
}


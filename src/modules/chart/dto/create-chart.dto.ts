import { IsString, IsEnum, IsOptional, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChartName, ChartStatus } from 'generated/prisma';
import { CreateBarChartDto } from './barchartDto';

export class CreateChartDto extends CreateBarChartDto   {
  @ApiProperty({
    example: 'Weekly Sleep Pattern',
    description: 'Title of the chart.',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: ChartStatus.ACTIVE,
    description: 'Current status of the chart.',
    enum: ChartStatus,
  })
  @IsEnum(ChartStatus)
  status: ChartStatus;

  @ApiProperty({
    example: ChartName.AREA,
    description: 'Category or type of chart.',
    enum: ChartName,
  })
  @IsEnum(ChartName)
  category: ChartName;

  @ApiProperty({
    example: '{"labels":["Mon","Tue","Wed"],"values":[6,7,8]}',
    description: 'X-axis data in JSON format.',
  })
  @IsJSON()
  xAxis: string;

  @ApiProperty({
    example: '{"labels":["Mon","Tue","Wed"],"values":[70,80,90]}',
    description: 'Y-axis data in JSON format.',
  })
  @IsOptional()
  @IsJSON()
  yAxis?: string;

  @ApiProperty({
    example: '{"labels":["Mon","Tue","Wed"],"values":[1,2,3]}',
    description: 'Optional Z-axis data in JSON format.',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  zAxis?: string;
}

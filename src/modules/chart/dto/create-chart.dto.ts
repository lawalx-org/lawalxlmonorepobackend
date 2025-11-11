import { IsString, IsEnum, IsOptional, IsJSON } from 'class-validator';
import { ChartName, ChartStatus } from 'generated/prisma';


export class CreateChartDto {
  @IsString()
  title: string;

  @IsEnum(ChartStatus)
  status: ChartStatus;

  @IsEnum(ChartName)
  category: ChartName;

  @IsJSON()
  xAxis: string;

  @IsJSON()
  yAxis: string;

  @IsOptional()
  @IsJSON()
  zAxis?: string;
}

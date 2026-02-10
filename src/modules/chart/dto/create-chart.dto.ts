// import { IsString, IsEnum, IsOptional, IsJSON, IsUUID, IsBoolean } from 'class-validator';
// import { ApiProperty, IntersectionType } from '@nestjs/swagger';
// import { ChartName, ChartStatus } from 'generated/prisma';
// import { CreateBarChartDto } from './barchartDto';
// import { Create_Hr_BarChartDto } from './hr_bar_chartDto';
// import { Create_Pi_ChartDto } from './pi_ChartDto';
// import { HeatMap_ChartDto } from './heatMap_chartDto';
// import { Area_ChartDto } from './areaChart.dto';
// import { MultiAxis_ChartDto } from './multiAxisChart.dto';
// import { Column_ChartDto } from './columnChart.dto';
// import { Stacker_Bar_ChartDto } from './stackerbarchart.dto';
// import { Pareto_ChartDto } from './peretoChart.dto';
// import { Histogram_ChartDto } from './histrogram.dto';
// import { SolidGauge_ChartDto } from './solideGauge.dto';
// import { Funnel_ChartDto } from './funelChart.dto';
// import { WaterFall_ChartDto } from './waterfall.dto';
// import { Radar_ChartDto } from './radarChart.dto';
// import { DOUGHNUT_ChartDto } from './dougnnut.dto';
// import { CandleStick_ChartDto } from './candelsick.dto';
// import { Scatter_ChartDto } from './scatter.dto';

// export class CreateChartDto extends IntersectionType(
//   CreateBarChartDto,
//   Create_Hr_BarChartDto,
//   Create_Pi_ChartDto,
//   HeatMap_ChartDto,
//   Area_ChartDto,
//   MultiAxis_ChartDto,
//   Column_ChartDto,
//   Stacker_Bar_ChartDto,
//   Pareto_ChartDto,
//   Histogram_ChartDto,
//   SolidGauge_ChartDto,
//   Funnel_ChartDto,
//   WaterFall_ChartDto,
//   Radar_ChartDto,
//   DOUGHNUT_ChartDto,
//   CandleStick_ChartDto,
//   Scatter_ChartDto


// ) {
//   @ApiProperty({
//     example: 'Weekly Sleep Pattern',
//     description: 'Title of the chart.',
//   })
//   @IsString()
//   title: string;

//   @ApiProperty({
//     example: ChartStatus.INACTIVE,
//     enum: ChartStatus,
//   })
//   @IsEnum(ChartStatus)
//   status: ChartStatus;

//   @ApiProperty({
//     example: ChartName.BAR,
//     enum: ChartName,
//   })
//   @IsEnum(ChartName)
//   category: ChartName;

//   @ApiProperty({
//     example: '{\"labels\":[[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]}',
//   })
//   @IsJSON()
//   xAxis: string;

//   @ApiProperty({
//     example: '{\"labels\":[[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]}',
//   })
//   @IsOptional()
//   @IsJSON()
//   yAxis?: string;

//   @ApiProperty({
//     example: '{\"labels\":[[\"Sunday\",1,2,3],[\"Monday\",2,3,4],[\"Tuesday\",3,4,5],[\"Wednesday\",4,5,6],[\"Thursday\",5,6,7],[\"Friday\",6,7,8],[\"Saturday\",7,8,9]]}',
//     required: false,
//   })
//   @IsOptional()
//   @IsJSON()
//   zAxis?: string;

//   @ApiProperty({
//     example: 'project uuid',
//   })
//   @IsUUID()
//   @IsOptional()
//   projectId?: string;

//   @ApiProperty({
//     example: 'parentId uuid',
//   })
//   @IsUUID()
//   @IsOptional()
//   parentId?: string;

//   @ApiProperty({
//     example:true,
//   })
//   @IsBoolean()
//   @IsOptional()
//   rootchart?: boolean;

//   @ApiProperty({
//     example: 'parentId uuid',
//   })
//   @IsOptional()
//    roottitle?: string
// }







// import { IsEnum, IsJSON, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
// import { ChartName, ChartStatus, NodeType } from "generated/prisma";
// import { WidgetDto } from "./hr_bar_chartDto";
// import { Type } from "class-transformimport { IsEnum, IsJSON, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
// import { ChartName, ChartStatus, NodeType } from "generated/prisma";
// import { WidgetDto } from "./hr_bar_chartDto";
// import { Type } from "class-transformer";
// import { ApiProperty } from "@nestjs/swagger";

// export class CreateChartDto {
//   @IsString()
//   title: string;

//   @IsEnum(ChartStatus)
//   status: ChartStatus;

//   @IsEnum(ChartName)
//   category: ChartName;

//   @IsOptional() @IsEnum(NodeType)
//   nodeType?: NodeType;

//   @IsJSON()
//   xAxis: string;

//   @IsJSON()
//   @IsOptional()
//   yAxis: string;

//   @IsJSON()
//   @IsOptional()
//   zAxis: string;


//   @IsUUID() @IsOptional()
//   parentId?: string;

//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => WidgetDto)
//   widgets?: WidgetDto[];

//   @ApiProperty({
//     example: 'project uuid',
//   })
//   @IsUUID()
//   @IsOptional()
//   projectId?: string;
// }er";
// import { ApiProperty } from "@nestjs/swagger";

// export class CreateChartDto {
//   @IsString()
//   title: string;

//   @IsEnum(ChartStatus)
//   status: ChartStatus;

//   @IsEnum(ChartName)
//   category: ChartName;

//   @IsOptional() @IsEnum(NodeType)
//   nodeType?: NodeType;

//   @IsJSON()
//   xAxis: string;

//   @IsJSON()
//   @IsOptional()
//   yAxis: string;

//   @IsJSON()
//   @IsOptional()
//   zAxis: string;


//   @IsUUID() @IsOptional()
//   parentId?: string;

//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => WidgetDto)
//   widgets?: WidgetDto[];

//   @ApiProperty({
//     example: 'project uuid',
//   })
//   @IsUUID()
//   @IsOptional()
//   projectId?: string;
// }

// chart.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsJSON, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { ChartName, ChartStatus } from 'generated/prisma';

export class WidgetDto {
  @IsOptional() @IsString()
  legendName?: string;

  @IsOptional() @IsString()
  color?: string;

  @IsOptional() @IsNumber()
  value?: number;

  @IsInt()
  @Min(0)
  index: number;
}

// পাই চার্টের নিজস্ব কনফিগ আলাদা ক্লাস
export class Create_Pi_ChartDto {
  @IsOptional() @IsInt()
  numberOfDataset?: number;

  @IsOptional() @IsInt()
  firstFieldDataset?: number;

  @IsOptional() @IsInt()
  lastFieldDataset?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WidgetDto)
  widgets?: WidgetDto[];
}

export class CreateChartDto {
  @IsString()
  title: string;

  @IsEnum(ChartStatus)
  status: ChartStatus;

  @IsEnum(ChartName)
  category: ChartName;

  @IsJSON()
  xAxis: string;

  @IsOptional() @IsJSON()
  yAxis?: string;

  @IsOptional() @IsUUID()
  parentId?: string;

  @IsOptional() @IsUUID()
  projectId?: string;

  // Chart Wise Config - এখন এটি আলাদা এবং ক্লিন
  @IsOptional()
  @ValidateNested()
  @Type(() => Create_Pi_ChartDto)
  piConfig?: Create_Pi_ChartDto;
}
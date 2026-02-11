import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsJSON, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class UpdateSingleChartDto {

   @ApiProperty({
    description: 'Chart ID',
    example: 'c6b4e52f-88f6-4f7d-9e47-5a0c90b2d9ab',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The X-axis data for the chart as a JSON string',
    example: '{"labels":[["Sunday",1,2,3],["Monday",2,3,4],["Tuesday",3,4,5],["Wednesday",4,5,6],["Thursday",5,6,7],["Friday",6,7,8],["Saturday",7,8,9]]}',
  })
  @IsString()
  @IsJSON()
  xAxis: string;

  @ApiProperty({
    description: 'Optional Y-axis data as JSON string',
    required: false,
    example: '{"values":[10,20,30,40,50,60,70]}',
  })
  @IsOptional()
  @IsString()
  @IsJSON()
  yAxis?: string;

  @ApiProperty({
    description: 'Optional Z-axis data as JSON string',
    required: false,
    example: '{"values":[5,15,25,35,45,55,65]}',
  })
  @IsOptional()
  @IsString()
  @IsJSON()
  zAxis?: string;
}



export class UpdateMultipleChartsDto {
  @ApiProperty({
    description: 'Array of chart update objects',
    type: [UpdateSingleChartDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSingleChartDto)
  charts: UpdateSingleChartDto[];
}

// import { Type } from 'class-transformer';
// import {
//     ArrayMinSize,
//     IsArray,
//     IsInt,
//     IsString,
//     ValidateNested,
//     IsOptional,
// } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// // import { WidgetDto } from './widgets.dto';

// // export class WidgetDto {
// //     @ApiPropertyOptional({
// //         description: 'Name that will appear in the chart legend',
// //         example: 'Revenue 2024',
// //     })
// //     @IsOptional()
// //     @IsString()
// //     legendName?: string;

// //     @ApiPropertyOptional({
// //         description: 'Color of the dataset in hex format (with #)',
// //         example: '#3B82F6',
// //     })
// //     @IsOptional()
// //     @IsString()
// //     color?: string;
// // }

// // export class Create_Pi_ChartDto {
// //     @ApiPropertyOptional({
// //         description: 'Total number of datasets available',
// //         example: 5,
// //     })
// //     @IsOptional()
// //     @IsInt()
// //     numberOfDataset?: number;


// //     @ApiPropertyOptional({
// //         description: 'Index of the first dataset to display (inclusive)',
// //         example: 0,
// //     })
// //     @IsOptional()
// //     @IsInt()
// //     firstFieldDataset?: number;

// //     @ApiPropertyOptional({
// //         description: 'Index of the last dataset to display (inclusive)',
// //         example: 4,
// //     })
// //     @IsOptional()
// //     @IsInt()
// //     lastFieldDataset?: number;

// //     @IsOptional()
// //     @IsArray()
// //     @ArrayMinSize(1)
// //     @ValidateNested({ each: true })
// //     @Type(() => WidgetDto)
// //     widgets?: WidgetDto[];
// // }

// export class Create_Pi_ChartDto {
//     @ApiPropertyOptional({ example: 3 })
//     @IsOptional()
//     @IsInt()
//     numberOfDataset?: number;

//     @ApiPropertyOptional({ example: 0 })
//     @IsOptional()
//     @IsInt()
//     firstFieldDataset?: number;

//     @ApiPropertyOptional({ example: 2 })
//     @IsOptional()
//     @IsInt()
//     lastFieldDataset?: number;

//     @ApiPropertyOptional({
//         description: 'Determines if this pie chart represents a leaf node (user input) or parent (aggregated sum)',
//         example: 'LEAF'
//     })
//     @IsOptional()
//     @IsString()
//     nodeType?: 'PARENT' | 'LEAF';

//     @IsOptional()
//     @IsArray()
//     @ArrayMinSize(1)
//     @ValidateNested({ each: true })
//     @Type(() => WidgetDto)
//     widgets?: WidgetDto[];
// }
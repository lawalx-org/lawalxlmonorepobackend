import { IsString, IsArray, IsEnum } from "class-validator";
import { ChartName } from "generated/prisma";

export class ChartWizardDto {
    @IsArray()
    @IsEnum(ChartName, { each: true }) 
    chartType: ChartName[];

    @IsString()
    sheetId: string;
}

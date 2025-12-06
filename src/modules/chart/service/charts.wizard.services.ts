import { Injectable, BadRequestException } from '@nestjs/common';
import { stack_bar_ChartConfigDto } from '../dto/update-all-charts.dto';

@Injectable()
export class ChartsWizardServices {
  private chartConfig: stack_bar_ChartConfigDto;

  async setChart(config: stack_bar_ChartConfigDto): Promise<stack_bar_ChartConfigDto> {
  const labelCount = config.number_of_labels;


  if (!config.show_widget || config.show_widget.length !== 3) {
    throw new BadRequestException(`There must be exactly 3 legends.`);
  }


  if (!config.xAxisLabels || config.xAxisLabels.length === 0) {
    config.xAxisLabels = Array.from({ length: labelCount }, (_, i) => `Label${i + 1}`);
  }


  for (const ds of config.show_widget) {
    if (!ds.values || ds.values.length === 0) {
      ds.values = Array.from({ length: labelCount }, () => "0");
    }
  }


  if (config.xAxisLabels.length !== labelCount) {
    throw new BadRequestException(
      `xAxisLabels length (${config.xAxisLabels.length}) must match number_of_labels (${labelCount})`
    );
  }

  
  for (const ds of config.show_widget) {
    if (!ds.values || ds.values.length !== labelCount) {
      throw new BadRequestException(
        `Legend "${ds.legend_name}" values length (${ds.values?.length || 0}) must match number_of_labels (${labelCount})`
      );
    }
  }

  this.chartConfig = { ...config };
  return this.chartConfig;
}

}

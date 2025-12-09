import { Injectable, BadRequestException } from '@nestjs/common';
import { stack_bar_ChartConfigDto } from '../dto/update-all-charts.dto';
import { HeatmapChartDto } from '../dto/heat_map.Dto';
import { multiAxisLineChartDto } from '../dto/multiAxisChart.Dto';

@Injectable()
export class ChartsWizardServices {
  private chartConfig: stack_bar_ChartConfigDto;

  async stackBarChart(config: stack_bar_ChartConfigDto): Promise<stack_bar_ChartConfigDto> {
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

  async heatmapChart(config: HeatmapChartDto): Promise<HeatmapChartDto> {

    const xCount = config.number_of_data_set_X;
    const yCount = config.number_of_data_set_Y;

    /** Validate X  */
    if (!config.xAxisLabels_name || config.xAxisLabels_name.length === 0) {
      config.xAxisLabels_name = Array.from({ length: xCount }, (_, i) => `X${i + 1}`);
    }

    if (config.xAxisLabels_name.length !== xCount) {
      throw new BadRequestException(
        `xAxisLabels_name length (${config.xAxisLabels_name.length}) must match number_of_data_set_X (${xCount})`
      );
    }

    /** Validate y */
    if (!config.yAxisLabels_name || config.yAxisLabels_name.length === 0) {
      config.yAxisLabels_name = Array.from({ length: yCount }, (_, i) => `Y${i + 1}`);
    }

    if (config.yAxisLabels_name.length !== yCount) {
      throw new BadRequestException(
        `yAxisLabels_name length (${config.yAxisLabels_name.length}) must match number_of_data_set_Y (${yCount})`
      );
    }

    return config;
  }
  async multiAxisLineChart(config: multiAxisLineChartDto): Promise<multiAxisLineChartDto> {

    const count = config.number_of_data_set_Labels_X;


    if (!config.xAxisLabels_name || config.xAxisLabels_name.length !== count) {
      throw new BadRequestException(
        `xAxisLabels_name length (${config.xAxisLabels_name?.length || 0}) must match number_of_data_set_Labels_X (${count})`
      );
    }

    if (!config.Data1.data || config.Data1.data.length !== count) {
      throw new BadRequestException(
        `Data1 data length (${config.Data1.data?.length || 0}) must match number_of_data_set_Labels_X (${count})`
      );
    }

    if (!config.Data2.data || config.Data2.data.length !== count) {
      throw new BadRequestException(
        `Data2 data length (${config.Data2.data?.length || 0}) must match number_of_data_set_Labels_X (${count})`
      );
    }

    return config;
  }
}



import { Body, Controller, Post } from "@nestjs/common";
import { ChartsWizardServices } from "../service/charts.wizard.services";
import {  stack_bar_ChartConfigDto } from "../dto/update-all-charts.dto";
import { HeatmapChartDto } from "../dto/heat_map.Dto";
import { multiAxisLineChartDto } from "../dto/multiAxisChart.Dto";

@Controller("charts")
export class ChartsController {
  constructor(private readonly chartsService: ChartsWizardServices) {}


  @Post('stack-bar-chart')
  async setChart_stack_chart(@Body() config: stack_bar_ChartConfigDto): Promise<stack_bar_ChartConfigDto> {
    return this.chartsService.stackBarChart(config);
  }
  @Post('heat-map-chart')
  async setChart_heat_map_chart(@Body() config: HeatmapChartDto): Promise<HeatmapChartDto> {
    return this.chartsService.heatmapChart(config);
  }
  @Post('multi-axis-line-chart')
  async setChart_multi_axis_line_chart (@Body() config: multiAxisLineChartDto): Promise<multiAxisLineChartDto> {
    return this.chartsService.multiAxisLineChart(config);
  }
}

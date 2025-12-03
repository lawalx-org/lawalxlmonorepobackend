import { Controller, Get } from '@nestjs/common';
import { ChartsWizardServices } from '../service/charts.wizard.services';


@Controller('charts')
export class ChartsWizardController {
    constructor(private readonly chartService: ChartsWizardServices) { }

//   @Get('chartDetails')
//   findChartDetails(@Param('type') type: string) {
//       if( ChartName.BAR == type  ){
//             await this.chartService.
//       }

//     return this.chartService.findOne(id);
//   }

    @Get('stack-bar')
    async getStackBarChart() {
        return await this.chartService.stack_bar_chart();
    }

    @Get('radar')
    async getRadarChart() {
        return await this.chartService.radar_chart();
    }

    @Get('doughnut-pi')
    async getDoughnutPiChart() {
        return await this.chartService.doughnut_pi_chart();
    }

    @Get('heatmap')
    async getHeatMapChart() {
        return await this.chartService.heatMap_chart();
    }

    @Get('horizontal-bar')
    async getHorizontalBarChart() {
        return await this.chartService.horizontal_bar_chart();
    }

    @Get('multi-axis-line')
    async getMultiAxisLineChart() {
        return await this.chartService.multi_axis_line_chart();
    }

    @Get('area')
    async getAreaChart() {
        return await this.chartService.area_chart();
    }

    @Get('stack-bar-horizontal')
    async getStackBarHorizontalChart() {
        return await this.chartService.stack_bar_chart_horizontal();
    }

    @Get('column')
    async getColumnChart() {
        return await this.chartService.column_chart();
    }

    @Get('pi')
    async getPiChart() {
        return await this.chartService.pi_chart();
    }

    @Get('doughnut')
    async getDoughnutChart() {
        return await this.chartService.doughnut_chart();
    }

    @Get('pareto')
    async getParetoChart() {
        return await this.chartService.pareto_chart();
    }

    @Get('funnel')
    async getFunnelChart() {
        return await this.chartService.funnel_chart();
    }

    @Get('scatter')
    async getScatterChart() {
        return await this.chartService.scatter_chart();
    }

    @Get('bubble')
    async getBubbleChart() {
        return await this.chartService.bubble_chart();
    }

    @Get('histogram')
    async getHistogramChart() {
        return await this.chartService.histogram_chart();
    }

    @Get('waterfall')
    async getWaterfallChart() {
        return await this.chartService.waterFall_chart();
    }

    @Get('solid-gauge')
    async getSolidGaugeChart() {
        return await this.chartService.solid_gauge_chart();
    }

    @Get('candlestick')
    async getCandlestickChart() {
        return await this.chartService.candlestick_chart();
    }

    @Get('geography-graph')
    async getGeographyGraphChart() {
        return await this.chartService.geography_graph_chart();
    }

    @Get('spline')
    async getSplineChart() {
        return await this.chartService.spline_chart();
    }
}

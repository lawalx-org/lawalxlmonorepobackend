import { Body, Controller, Post } from "@nestjs/common";
import { ChartsWizardServices } from "../service/charts.wizard.services";
import { stack_bar_ChartConfigDto } from "../dto/update-all-charts.dto";

@Controller("charts")
export class ChartsController {
  constructor(private readonly chartsService: ChartsWizardServices) {}


  @Post('stack-bar-chart')
  async setChart(@Body() config: stack_bar_ChartConfigDto): Promise<stack_bar_ChartConfigDto> {
    return this.chartsService.setChart(config);
  }
}

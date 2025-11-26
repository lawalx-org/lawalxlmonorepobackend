import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientDashboardStack } from '../services/client.dashboard.stack.services';

@ApiTags('client dashboard stack')
@Controller('client-stack-dashboard')
export class ClientDashboardStackController {
  constructor(private readonly clientDashboardStack: ClientDashboardStack) {}
 @Get("overview-stack")
  async overview() {
    const overview= await this.clientDashboardStack.getDashboardOverview();
    return {
        message:"client stack fetch successfully",
        data:overview
    }
  }
}


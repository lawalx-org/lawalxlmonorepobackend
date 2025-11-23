import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientDashboardStack } from '../services/client.dashboard.stack.services';

@ApiTags('client dashboard stack')
@Controller('client_stack_dashboard')
export class ClientDashboardStackController {
  constructor(private readonly clientDashboardStack: ClientDashboardStack) {}
 @Get("overview-stack")
  async overview() {
    const data= this.clientDashboardStack.getDashboardOverview;
    return {
        msg:"client stack fetch successfully ",
        data
    }
  }

  
}


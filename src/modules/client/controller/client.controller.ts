import { Controller, Get, Param } from '@nestjs/common';
import { ClientService } from '../service/client.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Client Management')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll() {
    return this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }
}

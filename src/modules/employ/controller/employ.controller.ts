import { Body, Controller, Post } from '@nestjs/common';
import { CreateSubmittedDto } from '../../submitted/dto/create-submitted.dto';
import { SubmittedService } from '../../submitted/service/submitted.service';

@Controller('employ')
export class EmployController {
  constructor(private readonly submittedService: SubmittedService) {}

  @Post('submit')
  create(@Body() createSubmittedDto: CreateSubmittedDto) {
    return this.submittedService.create(createSubmittedDto);
  }
}

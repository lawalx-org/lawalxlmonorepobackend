import { Controller } from '@nestjs/common';
import { ManagerService } from '../service/manager.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Manager Management')
@Controller('managers')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}
}

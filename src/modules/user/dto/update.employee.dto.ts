import { PartialType } from '@nestjs/swagger';
import { CreateStaffEmployeeDto } from './create.employee.dto';


export class UpdateStaffEmployeeDto extends PartialType(CreateStaffEmployeeDto) {}
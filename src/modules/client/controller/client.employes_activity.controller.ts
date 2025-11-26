import { Controller, Get, Query } from "@nestjs/common";

import { ApiTags, ApiQuery } from "@nestjs/swagger";
import { EmployeesActivityServices } from "../service/client.employees_activity.services";

@ApiTags('client Employees activity')
@Controller("employees")
export class Employees_activityController {
  constructor(private readonly employeesActivity: EmployeesActivityServices) {}
@Get("activity")
@ApiQuery({ name:'limit', required: false })
@ApiQuery({ name:'page', required: false })
@ApiQuery({ name:'userId', required: false })
@ApiQuery({ name:'startDate', required: false })
@ApiQuery({ name:'endDate', required: false })


async activity(
  
  @Query('userId') userId?: string,
  @Query('startDate') startDate?: string,
  @Query('endDate') endDate?: string,
  @Query('limit') limit?: string,
  @Query('page') page?: string,
) {
  const pageNumber = page ? Number(page) : 1; 
  const take = limit ? Number(limit) : 10;
  const skip = (pageNumber - 1) * take;

  const employees = await this.employeesActivity.getEmployeesActivity(
    userId,
    startDate ? new Date(startDate) : undefined,
    endDate ? new Date(endDate) : undefined,
    take,
    skip
  );

  return {
    message: "Employees activity fetched successfully",
    data: employees,
  };
}
}

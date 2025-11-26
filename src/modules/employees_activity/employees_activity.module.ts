import { Module } from "@nestjs/common";
import { Employees_activityController } from "./controller/employes_activity.controller";
import { EmployeesActivityServices } from "./services/employees_activity.services";

@Module({
    controllers:[Employees_activityController],
    providers:[EmployeesActivityServices]
})

export class employees_activityModule{}

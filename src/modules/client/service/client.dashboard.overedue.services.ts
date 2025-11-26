import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientDashboardOverdue_project {
    constructor(private readonly prisma:PrismaService) {}
    async getDashboardOverdueProjects () {
        const project = await this.prisma.project.findMany({
            where : {status:"OVERDUE"},
            select:{
                id:true,
                name:true,
                startDate:true,
                estimatedCompletedDate:true,
                
            }
        })

        return {
            project
        }
    }
};
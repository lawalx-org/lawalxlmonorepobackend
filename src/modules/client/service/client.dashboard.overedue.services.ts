import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientDashboardOverdue_Project {
    constructor(private readonly prisma: PrismaService) {}

    async getDashboardProjectsOverdue() {
        const projects = await this.prisma.project.findMany({
            where: { status: "OVERDUE" },
            select: {
                id: true,
                name: true,
                startDate: true,
                deadline: true,
                projectCompleteDate: true,
            }
        });

        const result = projects.map((project) => {
            let overdueDays = 0;

            if (project.startDate && project.projectCompleteDate) {
                const start = new Date(project.startDate);
                const complete = new Date(project.projectCompleteDate);

                const diffMs = complete.getTime() - start.getTime();
                overdueDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            }

            return {
                ...project,
                overdueDays
            };
        });

        return { projects: result };
    }
}

// {
//       id: 1,
//       name: Project x,
//       startDate: 2025-01-01,
//       deadline: 2025-01-10,
//       projectCompleteDate: 2025-01-30,
//       overdue: 20d
// },
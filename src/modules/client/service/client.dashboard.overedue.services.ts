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

            // Calculate only if completed and  deadline is available
            if (project.deadline && project.projectCompleteDate) {
                const deadline = new Date(project.deadline);
                const completed = new Date(project.projectCompleteDate);

                if (completed > deadline) {
                    const diffMs = completed.getTime() - deadline.getTime();
                    overdueDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                }
            }

            return {
                ...project,
                overdue: `${overdueDays}day`
            };
        });

        return {
             projects: result 
            };
    }
}

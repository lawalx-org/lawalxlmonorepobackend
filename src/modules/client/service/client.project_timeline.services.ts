import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProjectTimelineService {
    constructor(private readonly prisma: PrismaService) {}

    async getProjectTimeline(programId?: string, maxDays?: number) {

  
        if (!programId) {
            const first_Program = await this.prisma.program.findFirst({
                orderBy: { createdAt: 'asc' }
            });
            if (!first_Program) {
                return { message: "No programs found" };
            }
            programId = first_Program.id;
        }


        if (!maxDays) maxDays = 100;

        const projects = await this.prisma.project.findMany({
            where: { 
                programId
             },
            select: {
                id: true,
                name: true,
                startDate: true,
                estimatedCompletedDate: true,
                // project_end_Date: true, // add in project model schema
                updatedAt: true,// replace it need   project_end_Date  now only for check this 
            }
        });

        const ONE_DAY = 1000 * 60*60 *24;

        const ProjectData = projects.map(p =>{

            const start = p.startDate ?new Date(p.startDate).getTime() : null;
            // const end = p.project_end_Date ? new Date(p.project_end_Date).getTime() : null;
            const end = p.updatedAt ? new Date(p.updatedAt).getTime(): null;

            const estimated = p.estimatedCompletedDate ? new Date(p.estimatedCompletedDate).getTime() : null;

            let completionTime = 0;
            let savedTime =0;
            let overdueTime =0;

            if (start && end) {
                completionTime = Math.ceil ((end - start) /ONE_DAY);
            }

            if (estimated && end) {
                if (end < estimated)savedTime = Math.ceil
                ((estimated - end) / ONE_DAY);
                if (end > estimated) overdueTime = Math.ceil((end - estimated)/ ONE_DAY);
            }

            return {
                id: p.id,
                name:p.name,
                startDate:p.startDate,
                estimatedCompletedDate: p.estimatedCompletedDate,
                project_end_Date: p.updatedAt,
                completionTime,
                savedTime,
                overdueTime
            };
        })
        // -> Filter by maxDays: 1 to maxDays ----->: (under maxDays)
        .filter(item => item.completionTime >= 1 && item.completionTime <= maxDays);

        return {
            programId,
            maxDays,
            totalProjects: ProjectData.length,
            ProjectData
        };
    }
}

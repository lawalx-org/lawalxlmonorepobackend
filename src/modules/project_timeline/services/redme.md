import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectTimelineService {
    // Dummy data instead of Prisma
    private programs = [
        { id: "program1", name: "Program 1", createdAt: new Date("2025-01-01") },
        { id: "program2", name: "Program 2", createdAt: new Date("2025-02-01") }
    ];

    private projects = [
        {
            id: "proj1",
            name: "Project 1",
            programId: "program1",
            startDate: new Date("2025-01-01"),
            estimatedCompletedDate: new Date("2025-01-10"),
            updatedAt: new Date("2025-01-08")
        },
        {
            id: "proj2",
            name: "Project 2",
            programId: "program1",
            startDate: new Date("2025-01-05"),
            estimatedCompletedDate: new Date("2025-01-15"),
            updatedAt: new Date("2025-01-20")
        },
        {
            id: "proj3",
            name: "Project 3",
            programId: "program2",
            startDate: new Date("2025-01-10"),
            estimatedCompletedDate: new Date("2025-01-25"),
            updatedAt: new Date("2025-01-23")
        }
    ];

    async getProjectTimeline(programId?: string, maxDays?: number) {
        // Use first program if programId not provided
        if (!programId) {
            const firstProgram = this.programs[0];
            if (!firstProgram) return { message: "No programs found" };
            programId = firstProgram.id;
        }

        if (!maxDays) maxDays = 100;

        const projects = this.projects.filter(p => p.programId === programId);

        const ONE_DAY = 1000 * 60 * 60 * 24;

        const ProjectData = projects.map(p => {
            const start = p.startDate ? new Date(p.startDate).getTime() : null;
            const end = p.updatedAt ? new Date(p.updatedAt).getTime() : null;
            const estimated = p.estimatedCompletedDate ? new Date(p.estimatedCompletedDate).getTime() : null;

            let completionTime = 0;
            let savedTime = 0;
            let overdueTime = 0;

            if (start && end) {
                completionTime = Math.ceil((end - start) / ONE_DAY);
            }

            if (estimated && end) {
                if (end < estimated) savedTime = Math.ceil((estimated - end) / ONE_DAY);
                if (end > estimated) overdueTime = Math.ceil((end - estimated) / ONE_DAY);
            }

            return {
                id: p.id,
                name: p.name,
                startDate: p.startDate,
                estimatedCompletedDate: p.estimatedCompletedDate,
                project_end_Date: p.updatedAt,
                completionTime,
                savedTime,
                overdueTime
            };
        }).filter(item => item.completionTime >= 1 && item.completionTime <= maxDays);

        return {
            programId,
            maxDays,
            totalProjects: ProjectData.length,
            ProjectData
        };
    }
}

(async () => {
    const service = new ProjectTimelineService();
    const result = await service.getProjectTimeline(undefined, 15); // maxDays = 15
    console.log(JSON.stringify(result, null, 2));
})();



this is only for Cheka   porous

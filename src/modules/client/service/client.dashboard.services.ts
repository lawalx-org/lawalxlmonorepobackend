import { Injectable, NotFoundException } from "@nestjs/common";
import { startOfMonth, subMonths } from "date-fns";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientDashboardServices {
  constructor(private readonly prisma: PrismaService) { }

  //dashboard overview
  async getDashboardOverview() {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const calcGrowth = (thisMonth: number, lastMonth: number) => {
      if (lastMonth === 0) return 100;
      return Number(((thisMonth / lastMonth) * 100).toFixed(1));
    };


    // ------------------- Programs data ------ here all,ok
    const totalPrograms = await this.prisma.program.count();
    const programsThisMonth = await this.prisma.program.count({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const programsLastMonth = await this.prisma.program.count({
      where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });
    const programAdded = await this.prisma.program.findMany({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const programGrowth = calcGrowth(programsThisMonth, programsLastMonth);




    // ----- Projects ------ here al ok 
    const totalProjects = await this.prisma.project.count();
    const projectsThisMonth = await this.prisma.project.count({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const projectsLastMonth = await this.prisma.project.count({
      where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });
    const projectData = await this.prisma.project.findMany({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const projectGrowth = calcGrowth(projectsThisMonth, projectsLastMonth);





    // ------ Live Project data -----------------------------------------------------------

    const totalLive = await this.prisma.project.count({
      where: { status: "LIVE" },
    });
    const liveThisMonth = await this.prisma.project.count({
      where: { status: "LIVE", createdAt: { gte: thisMonthStart } },
    });
    const liveLastMonth = await this.prisma.project.count({
      where: { status: "LIVE", createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });

    const liveEmployees = await this.prisma.projectEmployee.findMany({
      where: { assignedAt: { gte: thisMonthStart } },
      include: { employee: true, project: true },
    });
    const liveGrowth = calcGrowth(liveThisMonth, liveLastMonth);





    // --------------------------------------------------------- Draft Projects -----------
    const totalDraft = await this.prisma.project.count({
      where: { status: "DRAFT" },
    });
    const draftThisMonth = await this.prisma.project.count({
      where: { status: "DRAFT", createdAt: { gte: thisMonthStart } },
    });
    const draftLastMonth = await this.prisma.project.count({
      where: { status: "DRAFT", createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });
    const draftClients = await this.prisma.client.findMany({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const draftGrowth = calcGrowth(draftThisMonth, draftLastMonth);



    // ---------------- pending review ---------
    const totalPendingReview = await this.prisma.review.count({
      where: { status: "PENDING" }
    });
    const pendingThisMonth = await this.prisma.project.count({
      where: { status: "PENDING", createdAt: { gte: thisMonthStart } },
    });
    const pendingLastMonth = await this.prisma.project.count({
      where: { status: "PENDING", createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });
    const pendingClients = await this.prisma.client.findMany({
      where: { createdAt: { gte: thisMonthStart } },
    });
    const pendingGrowth = calcGrowth(draftThisMonth, draftLastMonth);


    //--------------- submission  overdue ----------------

    const submitOverdue = await this.prisma.project.count({
      where: { status: "OVERDUE" }
    });

    const submitOverdueThisMonth = await this.prisma.project.count({
      where: { status: "OVERDUE", createdAt: { gte: thisMonthStart } },
    });
    const submitOverdueLastMonth = await this.prisma.project.count({
      where: { status: "OVERDUE", createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });
    const submitOverdueGrowth = calcGrowth(draftThisMonth, draftLastMonth);
    const leftUser = await this.prisma.program.findMany({
      where: { createdAt: { gte: thisMonthStart } },
    });



    return {
      programs: {
        total: totalPrograms,
        lastMonth: programsLastMonth,
        thisMonth: programsThisMonth,
        program_Added: programAdded,
        growth: programGrowth,
      },
      projects: {
        total: totalProjects,
        lastMonth: projectsLastMonth,
        thisMonth: projectsThisMonth,
        project_Data: projectData,
        growth: projectGrowth,
      },
      liveProjects: {
        total: totalLive,
        lastMonth: liveLastMonth,
        thisMonth: liveThisMonth,
        growth: liveGrowth,
        joinedEmployees: liveEmployees.map(e => ({
          employee: e.employee,
          project: e.project,
        })),
      },
      draftProjects: {
        total: totalDraft,
        lastMonth: draftLastMonth,
        thisMonth: draftThisMonth,
        growth: draftGrowth,
        draft_Clients: draftClients
      },
      pendingReview: {
        total: totalPendingReview,
        lastMonth: pendingThisMonth,
        thisMonth: pendingLastMonth,
        grow: pendingGrowth,
        pending_clients: pendingClients,
      },
      submitOverdue: {
        total: submitOverdue,
        laseMonth: submitOverdueThisMonth,
        lastMonth: submitOverdueLastMonth,
        grow: submitOverdueGrowth,
        client_left: leftUser
      }


    };
  }

  //employees activity
  async getEmployeesActivity(
    userId?: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 10,
    skip: number = 0,
  ) {

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }
    if (!userId) {
      throw new NotFoundException('This user is not found!');
    }
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const activities = await this.prisma.activity.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: limit,
      skip,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const result = activities.map(a => ({
      id: a.id,
      timeStamp: a.timestamp,
      user: a.user?.name ?? "unknown user",
      profileImage: a.user.profileImage,
      description: a.description,
      projectName: a.project?.name ?? "unknown project",
      projectId: a.projectId,
      ipAddress: a.ipAddress,
      actionType: a.actionType,
      metadata: a.metadata,
    }));

    return { result };
  }

  //project timeline
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
        deadline: true,
        // project_end_Date: true, // add in project model schema
        projectCompleteDate: true,// replace it need   project_end_Date  now only for check this 
      }
    });

    const ONE_DAY = 1000 * 60 * 60 * 24;

    const ProjectData = projects.map(p => {

      const start = p.startDate ? new Date(p.startDate).getTime() : null;
      // const end = p.project_end_Date ? new Date(p.project_end_Date).getTime() : null;
      const end = p.projectCompleteDate ? new Date(p.projectCompleteDate).getTime() : null;

      const estimated = p.deadline ? new Date(p.deadline).getTime() : null;

      let completionTime = 0;
      let savedTime = 0;
      let overdueTime = 0;

      if (start && end) {
        completionTime = Math.ceil((end - start) / ONE_DAY);
      }

      if (estimated && end) {
        if (end < estimated) savedTime = Math.ceil
          ((estimated - end) / ONE_DAY);
        if (end > estimated) overdueTime = Math.ceil((end - estimated) / ONE_DAY);
      }

      return {
        id: p.id,
        name: p.name,
        startDate: p.startDate,
        estimatedCompletedDate: p.deadline,
        project_end_Date: p.projectCompleteDate,
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

  //project status stack 
  async getProjectStatusStackGraph(period: 'week' | 'month' | 'year') {


    let datafilter = {};
    const now = new Date()

    if (period == 'month') {
      datafilter = {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      }
    }

    if (period == 'week') {
      const startWeek = new Date();
      const day = startWeek.getDay()
      startWeek.setDate(startWeek.getDate() - day + 1);
      startWeek.setHours(0, 0, 0, 0);

      const endWeek = new Date(startWeek);
      endWeek.setDate(startWeek.getDate() + 7)

      datafilter = { gte: startWeek, lt: endWeek };


    }

    if (period == 'year') {
      datafilter = {
        gte: new Date(now.getFullYear(), 0, 1),
        lt: new Date(now.getFullYear() + 1, 0, 1)
      }
    };

    const totalProject = await this.prisma.project.count(
      {
        where: { createdAt: datafilter }
      }
    );

    const statusCount = await this.prisma.project.groupBy({
      by: ['status'],
      where: { createdAt: datafilter },
      _count: { status: true }
    });

    const response = await statusCount.map((item) => {
      const count = item._count.status
      return {
        status: item.status,
        count,
        percentage: totalProject ? Number(((count / totalProject) * 100).toFixed(2)) : 0

      }
    });

    return {
      total: totalProject,
      breakdown: response,
      period,
    }




  }

  //project overdue 
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

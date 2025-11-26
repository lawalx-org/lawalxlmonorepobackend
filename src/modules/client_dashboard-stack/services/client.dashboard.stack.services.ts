import { Injectable } from '@nestjs/common';
import { startOfMonth, subMonths } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientDashboardStack {
  constructor(private readonly prisma: PrismaService) { }

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
}

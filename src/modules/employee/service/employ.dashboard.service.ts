import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // async getEmployeeDashboard(employeeId: string) {
  //   const totalProjectsAssigned = await this.prisma.projectEmployee.count({
  //     where: {
  //       employeeId,
  //     },
  //   });

  //   const totalSubmissions = await this.prisma.submitted.count({
  //     where: {
  //       employeeId,
  //     },
  //   });

  //   const totalReturns = await this.prisma.submissionReturn.count({
  //     where: {
  //       submitted: {
  //         employeeId,
  //       },
  //     },
  //   });

  //   const projects = await this.prisma.projectEmployee.findMany({
  //     where: {
  //       employeeId,
  //     },
  //     include: {
  //       project: true,
  //     },
  //   });

  //   const liveProjects = projects.filter((p) => p.project.status === 'LIVE');

  //   const overdueProjects = projects.filter(
  //     (p) =>
  //       p.project.deadline < new Date() && p.project.status !== 'COMPLETED',
  //   );

  //   return {
  //     totalProjectsAssigned,
  //     totalSubmissions,
  //     totalReturns,
  //     liveProjects: {
  //       count: liveProjects.length,
  //       projects: liveProjects.map((p) => p.project),
  //     },
  //     overdueProjects: {
  //       count: overdueProjects.length,
  //       projects: overdueProjects.map((p) => p.project),
  //     },
  //   };
  // }

  /* ---------- Helpers ---------- */
  private getMonthRange(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
    );
    return { start, end };
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  /* ---------- Dashboard ---------- */
  async getEmployeeDashboard(employeeId: string) {
    const now = new Date();

    const currentMonth = this.getMonthRange(now);
    const previousMonth = this.getMonthRange(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );

    /* ================= Assigned Projects ================= */
    const totalAssigned = await this.prisma.projectEmployee.count({
      where: { employeeId },
    });

    const currentAssigned = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
        project: {
          createdAt: {
            gte: currentMonth.start,
            lte: currentMonth.end,
          },
        },
      },
    });

    const previousAssigned = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
        project: {
          createdAt: {
            gte: previousMonth.start,
            lte: previousMonth.end,
          },
        },
      },
    });

    /* ================= Submitted For Review ================= */
    const currentSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId,
        createdAt: {
          gte: currentMonth.start,
          lte: currentMonth.end,
        },
      },
    });

    const previousSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId,
        createdAt: {
          gte: previousMonth.start,
          lte: previousMonth.end,
        },
      },
    });

    /* ================= Returned For Edit (FIXED) ================= */
    const currentReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId,
          createdAt: {
            gte: currentMonth.start,
            lte: currentMonth.end,
          },
        },
      },
    });

    const previousReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId,
          createdAt: {
            gte: previousMonth.start,
            lte: previousMonth.end,
          },
        },
      },
    });

    /* ================= Live Projects ================= */
    const currentLiveProjects = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
        project: {
          status: 'LIVE',
          createdAt: {
            gte: currentMonth.start,
            lte: currentMonth.end,
          },
        },
      },
    });

    const previousLiveProjects = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
        project: {
          status: 'LIVE',
          createdAt: {
            gte: previousMonth.start,
            lte: previousMonth.end,
          },
        },
      },
    });

    /* ================= Overdue Projects ================= */
    const overdueProjects = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
        project: {
          deadline: { lt: new Date() },
          status: { not: 'COMPLETED' },
        },
      },
    });

    /* ================= Response ================= */
    return {
      totalAssignedProject: {
        count: totalAssigned,
        growth: this.calculateGrowth(currentAssigned, previousAssigned),
      },

      submittedForReview: {
        count: currentSubmissions,
        growth: this.calculateGrowth(currentSubmissions, previousSubmissions),
      },

      returnedForEdit: {
        count: currentReturns,
        growth: this.calculateGrowth(currentReturns, previousReturns),
      },

      liveProjects: {
        count: currentLiveProjects,
        growth: this.calculateGrowth(currentLiveProjects, previousLiveProjects),
      },

      overdueProjects: {
        count: overdueProjects,
      },
    };
  }

  async getLiveProjects(employeeId: string) {
    const projects = await this.prisma.projectEmployee.findMany({
      where: {
        employeeId,
        project: {
          status: 'LIVE',
        },
      },
      include: {
        project: true,
      },
    });
    return projects.map((p) => p.project);
  }

  async getOverdueProjects(employeeId: string) {
    const projects = await this.prisma.projectEmployee.findMany({
      where: {
        employeeId,
        project: {
          deadline: {
            lt: new Date(),
          },
          status: {
            not: 'COMPLETED',
          },
        },
      },
      include: {
        project: true,
      },
    });
    return projects.map((p) => p.project);
  }

  async getSubmissionReturns(employeeId: string) {
    const submissionReturns = await this.prisma.submissionReturn.findMany({
      where: {
        submitted: {
          employeeId,
        },
      },
      include: {
        submitted: true,
      },
    });
    return submissionReturns.map((r) => r.submitted);
  }

  async getEmployeePerformance(employeeId: string) {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const currentMonthProjects = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
        assignedAt: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthProjects = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
        assignedAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    const currentMonthSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId,
        createdAt: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId,
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    const currentMonthReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId,
        },
        returnedAt: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId,
        },
        returnedAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) {
        return current > 0 ? '100%' : '0%';
      }
      const change = ((current - previous) / previous) * 100;
      return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
    };

    return {
      projects: {
        currentMonth: currentMonthProjects,
        previousMonth: previousMonthProjects,
        percentageChange: calculatePercentageChange(
          currentMonthProjects,
          previousMonthProjects,
        ),
      },
      submissions: {
        currentMonth: currentMonthSubmissions,
        previousMonth: previousMonthSubmissions,
        percentageChange: calculatePercentageChange(
          currentMonthSubmissions,
          previousMonthSubmissions,
        ),
      },
      returns: {
        currentMonth: currentMonthReturns,
        previousMonth: previousMonthReturns,
        percentageChange: calculatePercentageChange(
          currentMonthReturns,
          previousMonthReturns,
        ),
      },
    };
  }

  private calculateOverdueDays(deadline: Date): number {
    const now = new Date();
    const diff =
      (now.getTime() - new Date(deadline).getTime()) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  }

  private getPriorityLabel(priority: string): string {
    if (priority === 'LOW') return 'Low';
    if (priority === 'MEDIUM') return 'Medium';
    if (priority === 'HIGH') return 'Critical';
    return 'Low';
  }

  async getTopOverdueProjects(employeeId: string) {
    const assignments = await this.prisma.projectEmployee.findMany({
      where: { employeeId },
      include: { project: true },
    });

    const formatted = assignments.map((item) => {
      const overdueDays = this.calculateOverdueDays(item.project.deadline as any);
      return {
        id: item.project.id,
        name: item.project.name,
        status: item.project.status,
        overdueDays: overdueDays > 0 ? overdueDays : 0,
        priority: this.getPriorityLabel(item.project.priority),
        deadline: item.project.deadline,
      };
    });

    const overdueProjects = formatted
      .filter((p) => p.overdueDays > 0)
      .sort((a, b) => b.overdueDays - a.overdueDays);

    return {
      totalProjects: formatted.length,
      overdueCount: overdueProjects.length,
      projects: formatted,
      overdueProjects,
    };
  }

  // async getSubmissionStatus(employeeId: string) {
  //   const submissions = await this.prisma.submitted.findMany({
  //     where: { employeeId },
  //     include: {
  //       project: true,
  //     }
  //   });

  //   const total = submissions.length;

  //   let submitted = 0;
  //   let live = 0;
  //   let returned = 0;
  //   let overdue = 0;

  //   const now = new Date();

  //   submissions.forEach((item) => {

  //     if (item.status === 'APPROVED') submitted++;
  //     if (item.status === 'PENDING') live++;
  //     if (item.status === 'REJECTED') returned++;

  //     if (new Date(item.project.deadline as any) < now && item.status !== 'APPROVED') {
  //       overdue++;
  //     }
  //   });

  //   return {
  //     total,

  //     counts: {
  //       submitted,
  //       live,
  //       returned,
  //       overdue,
  //     },

  //     percentages: {
  //       submitted: total ? Math.round((submitted / total) * 100) : 0,
  //       live: total ? Math.round((live / total) * 100) : 0,
  //       returned: total ? Math.round((returned / total) * 100) : 0,
  //       overdue: total ? Math.round((overdue / total) * 100) : 0,
  //     }
  //   };
  // }

  async getSubmissionStatus(employeeId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const submissions = await this.prisma.submitted.findMany({
      where: {
        employeeId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { project: true },
    });

    const total = submissions.length;

    let submitted = 0;
    let live = 0;
    let returned = 0;
    let overdue = 0;

    const now = new Date();

    submissions.forEach((item) => {
      const status = item.status.toUpperCase();

      if (status === 'APPROVED' || status === 'SUBMITTED') submitted++;
      if (status === 'PENDING') live++;
      if (status === 'REJECTED') returned++;

      if (new Date(item.project.deadline as any) < now && status !== 'APPROVED') {
        overdue++;
      }
    });

    return {
      total,
      counts: {
        submitted,
        live,
        returned,
        overdue,
      },
      percentages: {
        submitted: total ? Math.round((submitted / total) * 100) : 0,
        live: total ? Math.round((live / total) * 100) : 0,
        returned: total ? Math.round((returned / total) * 100) : 0,
        overdue: total ? Math.round((overdue / total) * 100) : 0,
      },
      month,
      year,
    };
  }

  async upcomingDeadlineProjects(employeeId: string, days = 8) {
    const today = new Date();
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const projects = await this.prisma.project.findMany({
      where: {
        status: 'LIVE',
        deadline: {
          gte: today,
          lte: new Date(today.getTime() + days * ONE_DAY),
        },
        projectEmployees: {
          some: {
            employeeId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        program: {
          select: {
            programName: true,
          },
        },
        projectEmployees: {
          where: {
            employeeId,
          },
          select: {
            employee: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    profileImage: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
    });

    const formatted = projects.map((project) => {
      const diffMs = new Date(project.deadline as any).getTime() - today.getTime();
      const daysLeft = Math.ceil(diffMs / ONE_DAY);

      return {
        programName: project.program?.programName ?? 'No Program',
        projectId: project.id,
        projectName: project.name,
        deadline: project.deadline,
        daysLeft,
        employees: project.projectEmployees.map((pe) => ({
          id: pe.employee.id,
          name: pe.employee.user?.name ?? 'Unknown',
          profileImage: pe.employee.user?.profileImage ?? null,
        })),
      };
    });

    return {
      total: formatted.length,
      projects: formatted,
    };
  }

  
}

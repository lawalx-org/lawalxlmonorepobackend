import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmployDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getEmployeeDashboard(employeeId: string) {
    const totalProjectsAssigned = await this.prisma.projectEmployee.count({
      where: {
        employeeId,
      },
    });

    const totalSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId,
      },
    });

    const totalReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId,
        },
      },
    });

    const projects = await this.prisma.projectEmployee.findMany({
      where: {
        employeeId,
      },
      include: {
        project: true,
      },
    });

    const liveProjects = projects.filter((p) => p.project.status === 'LIVE');

    const overdueProjects = projects.filter(
      (p) =>
        p.project.deadline < new Date() && p.project.status !== 'COMPLETED',
    );

    return {
      totalProjectsAssigned,
      totalSubmissions,
      totalReturns,
      liveProjects: {
        count: liveProjects.length,
        projects: liveProjects.map((p) => p.project),
      },
      overdueProjects: {
        count: overdueProjects.length,
        projects: overdueProjects.map((p) => p.project),
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

async employeeOverdueProject(employeeId: string) {
  const projects = await this.prisma.project.findMany({
    where: { 
      status: "OVERDUE",
      projectEmployees: {
        some: {
          employeeId: employeeId
        }
      }
    },
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
      overdue: `${overdueDays}`,
    };
  });

  return { projects: result };
}



async getEmployeeSubmittingStack(
  employeeId: string,
  period: "week" | "month" | "year"
) {
  let dateFilter: any = {};
  const now = new Date();

  if (period === "month") {
    dateFilter = {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
      lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  }

  if (period === "week") {
    const startWeek = new Date();
    const day = startWeek.getDay();
    startWeek.setDate(startWeek.getDate() - day + 1);
    startWeek.setHours(0, 0, 0, 0);

    const endWeek = new Date(startWeek);
    endWeek.setDate(startWeek.getDate() + 7);

    dateFilter = { gte: startWeek, lt: endWeek };
  }

  if (period === "year") {
    dateFilter = {
      gte: new Date(now.getFullYear(), 0, 1),
      lt: new Date(now.getFullYear() + 1, 0, 1),
    };
  }

  // 🎯 FETCH EMPLOYEE SUBMISSIONS
  const submissions = await this.prisma.submitted.findMany({
    where: {
      employeeId,
      createdAt: dateFilter,
    },
    select: { status: true },
  });

  const totalSub = submissions.length;

  const statusMap: Record<string, number> = {
    APPROVED: 0,
    PENDING: 0,
    REJECTED: 0,
  };

  submissions.forEach((s) => {
    if (statusMap[s.status] != null) statusMap[s.status]++;
  });

  const calcPercent = (count: number, total: number) =>
    total ? Number(((count / total) * 100).toFixed(2)) : 0;

  const projects = await this.prisma.projectEmployee.findMany({
    where: {
      employeeId,
    },
    include: {
      project: true,
    },
  });

  const totalProjects = projects.length;

  const overdueProjects = projects.filter(
    (p) => p.project.status === "OVERDUE"
  );

  const overdueCount = overdueProjects.length;
  const overduePercent = calcPercent(overdueCount, totalProjects);

  return {
    employeeId,
    period,
    totalSubmissions: totalSub,
    totalAssignedProjects: totalProjects,
    stack: {
      approved: {
        count: statusMap["APPROVED"],
        percentage: calcPercent(statusMap["APPROVED"], totalSub),
      },
      pending: {
        count: statusMap["PENDING"],
        percentage: calcPercent(statusMap["PENDING"], totalSub),
      },
      rejected: {
        count: statusMap["REJECTED"],
        percentage: calcPercent(statusMap["REJECTED"], totalSub),
      },
      overdue: {
        count: overdueCount,
        percentage: overduePercent,
      },
    },
  };
}

  async employeeUpcomingDeadlineProjects( employeeId: string,) {
    const today = new Date();
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const projects = await this.prisma.project.findMany({
      where: {
        status: "LIVE",
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        program: {
          select: {
            programName: true,
          }
        },
        projectEmployees: {
          select: {
            employee: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    profileImage: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const filtered = projects
      .map(project => {
        const deadline = new Date(project.deadline);
        const diffMs = deadline.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffMs / ONE_DAY);

        return {
          programName: project.program?.programName ?? "No Program",
          projectId: project.id,
          projectName: project.name,
          deadline: project.deadline,
          daysLeft,
          employees: project.projectEmployees.map(pe => ({
            id: pe.employee.id,
            name: pe.employee.user?.name ?? "Unknown",
            profileImage: pe.employee.user?.profileImage ?? null
          }))
        };
      })
      .filter(p => p.daysLeft <= 8 && p.daysLeft >= 0);

    return {
      employeeId,
      total: filtered.length,
      projects: filtered
    };
  }


}

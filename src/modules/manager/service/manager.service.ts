import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ManagerService {
  constructor(private readonly prisma: PrismaService) {}

  async getManagerDashboard(managerId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
      },
      include: {
        projectEmployees: {
          include: {
            employee: true,
          },
        },
      },
    });

    const employeeIds = projects.flatMap((p) =>
      p.projectEmployees.map((pe) => pe.employeeId),
    );

    const totalProjectsAssigned = projects.length;

    const totalSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId: {
          in: employeeIds,
        },
      },
    });

    const totalReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId: {
            in: employeeIds,
          },
        },
      },
    });

    const liveProjects = projects.filter((p) => p.status === 'LIVE').length;

    const overdueProjects = projects.filter(
      (p) => p.deadline < new Date() && p.status !== 'COMPLETED',
    ).length;

    return {
      totalProjectsAssigned,
      totalSubmissions,
      totalReturns,
      liveProjects,
      overdueProjects,
    };
  }

  async getLiveProjects(managerId: string) {
    return this.prisma.project.findMany({
      where: {
        managerId,
        status: 'LIVE',
      },
    });
  }

  async getOverdueProjects(managerId: string) {
    return this.prisma.project.findMany({
      where: {
        managerId,
        deadline: {
          lt: new Date(),
        },
        status: {
          not: 'COMPLETED',
        },
      },
    });
  }

  async getSubmissionReturns(managerId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
      },
      select: {
        projectEmployees: {
          select: {
            employeeId: true,
          },
        },
      },
    });

    const employeeIds = projects.flatMap((p) =>
      p.projectEmployees.map((pe) => pe.employeeId),
    );

    return this.prisma.submissionReturn.findMany({
      where: {
        submitted: {
          employeeId: {
            in: employeeIds,
          },
        },
      },
      include: {
        submitted: true,
      },
    });
  }

  async getManagerPerformance(managerId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
      },
      include: {
        projectEmployees: true,
      },
    });

    const employeeIds = projects.flatMap((p) =>
      p.projectEmployees.map((pe) => pe.employeeId),
    );

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const currentMonthProjects = projects.filter(
      (p) => new Date(p.createdAt) >= currentMonthStart,
    ).length;

    const previousMonthProjects = projects.filter(
      (p) =>
        new Date(p.createdAt) >= previousMonthStart &&
        new Date(p.createdAt) < currentMonthStart,
    ).length;

    const currentMonthSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId: {
          in: employeeIds,
        },
        createdAt: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthSubmissions = await this.prisma.submitted.count({
      where: {
        employeeId: {
          in: employeeIds,
        },
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthStart,
        },
      },
    });

    const currentMonthReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId: {
            in: employeeIds,
          },
        },
        returnedAt: {
          gte: currentMonthStart,
        },
      },
    });

    const previousMonthReturns = await this.prisma.submissionReturn.count({
      where: {
        submitted: {
          employeeId: {
            in: employeeIds,
          },
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
}

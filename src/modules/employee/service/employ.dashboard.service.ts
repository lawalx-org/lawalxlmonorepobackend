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
}

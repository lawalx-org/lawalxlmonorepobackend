import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjectStatus, TaskStatus } from '../../../generated/prisma';

@Injectable()
export class ChartService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubmissionStatusChartData(employeeId: string, period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'six-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const projectEmployees = await this.prisma.projectEmployee.findMany({
      where: {
        employeeId,
        project: {
          createdAt: {
            gte: startDate,
          },
        },
      },
      include: {
        project: true,
      },
    });

    const projects = projectEmployees.map((pe) => pe.project);

    const tasks = await this.prisma.task.findMany({
      where: {
        assignedTo: employeeId,
        assigneeType: 'EMPLOYEE',
        createdAt: {
          gte: startDate,
        },
      },
    });

    const projectStatusCounts = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {} as Record<ProjectStatus, number>,
    );

    const taskStatusCounts = tasks.reduce(
      (acc, t) => {
        if (t.status) {
          acc[t.status] = (acc[t.status] || 0) + 1;
        }
        return acc;
      },
      {} as Record<TaskStatus, number>,
    );

    return {
      totalProjects: projects.length,
      projectStatus: projectStatusCounts,
      taskStatus: taskStatusCounts,
    };
  }

  async getTopOverdueProjectsChartData(employeeId: string) {
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
      orderBy: {
        project: {
          deadline: 'asc',
        },
      },
      take: 5,
    });

    if (projects.length === 0) {
      return [];
    }

    const now = new Date();
    return projects.map((p) => {
      const deadline = new Date(p.project.deadline);
      const diffTime = Math.abs(now.getTime() - deadline.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let priority: string;
      if (diffDays > 30) {
        priority = 'Critical';
      } else if (diffDays > 20) {
        priority = 'Medium';
      } else {
        priority = 'Low';
      }

      return {
        projectName: p.project.name,
        overdueDays: diffDays,
        priority,
      };
    });
  }

  async getManagerSubmissionStatusChartData(managerId: string, period: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
      },
      include: {
        projectEmployees: true,
        tasks: true,
      },
    });

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'six-months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const filteredProjects = projects.filter(
      (p) => new Date(p.createdAt) >= startDate,
    );

    const tasks = filteredProjects.flatMap((p) => p.tasks);

    const projectStatusCounts = filteredProjects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {} as Record<ProjectStatus, number>,
    );

    const taskStatusCounts = tasks.reduce(
      (acc, t) => {
        if (t.status) {
          acc[t.status] = (acc[t.status] || 0) + 1;
        }
        return acc;
      },
      {} as Record<TaskStatus, number>,
    );

    return {
      totalProjects: filteredProjects.length,
      projectStatus: projectStatusCounts,
      taskStatus: taskStatusCounts,
    };
  }

  async getManagerTopOverdueProjectsChartData(managerId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        managerId,
        deadline: {
          lt: new Date(),
        },
        status: {
          not: 'COMPLETED',
        },
      },
      orderBy: {
        deadline: 'asc',
      },
      take: 5,
    });

    if (projects.length === 0) {
      return [];
    }

    const now = new Date();
    return projects.map((p) => {
      const deadline = new Date(p.deadline);
      const diffTime = Math.abs(now.getTime() - deadline.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let priority: string;
      if (diffDays > 30) {
        priority = 'Critical';
      } else if (diffDays > 20) {
        priority = 'Medium';
      } else {
        priority = 'Low';
      }

      return {
        projectName: p.name,
        overdueDays: diffDays,
        priority,
      };
    });
  }
}

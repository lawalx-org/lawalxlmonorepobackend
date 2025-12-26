import { Injectable, NotFoundException } from "@nestjs/common";
import { startOfMonth, subMonths } from "date-fns";
import { SubmittedStatus } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientDashboardServices {
  constructor(private readonly prisma: PrismaService) { }

  async getDashboardOverview() {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    // -------- Growth Function ------------
    const calcGrowth = (thisMonth: number, lastMonth: number) => {
      if (lastMonth === 0 && thisMonth === 0) return 0;
      if (lastMonth === 0 && thisMonth > 0) return 100;
      if (lastMonth > 0 && thisMonth === 0) return -100;

      const growth = ((thisMonth - lastMonth) / lastMonth) * 100;
      return Number(growth.toFixed(1));
    };


    // ------------------- Programs -----------------------
    const totalPrograms = await this.prisma.program.count();

    const programsAddedItems = await this.prisma.program.findMany({
      where: { createdAt: { gte: thisMonthStart } },
      orderBy: { createdAt: "desc" }
    });
    const programsThisMonth = programsAddedItems.length;

    const programsLastMonth = await this.prisma.program.count({
      where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });

    const programGrowth = calcGrowth(programsThisMonth, programsLastMonth);



    // ------------------- Projects -----------------------
    const totalProjects = await this.prisma.project.count();

    const projectsAddedItems = await this.prisma.project.findMany({
      where: { createdAt: { gte: thisMonthStart } },
      orderBy: { createdAt: "desc" }
    });
    const projectsThisMonth = projectsAddedItems.length;

    const projectsLastMonth = await this.prisma.project.count({
      where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });

    const projectGrowth = calcGrowth(projectsThisMonth, projectsLastMonth);



    // ------------------- Live Projects -------------------
    const totalLive = await this.prisma.project.count({
      where: { status: "LIVE" },
    });

    const liveAddedItems = await this.prisma.project.findMany({
      where: { status: "LIVE", createdAt: { gte: thisMonthStart } },
      orderBy: { createdAt: "desc" }
    });
    const liveThisMonth = liveAddedItems.length;

    const liveLastMonth = await this.prisma.project.count({
      where: {
        status: "LIVE",
        createdAt: { gte: lastMonthStart, lt: thisMonthStart }
      },
    });

    const liveUsersThisMonth = await this.prisma.projectEmployee.count({
      where: {
        assignedAt: { gte: thisMonthStart },
        project: { status: "LIVE" }
      }
    });

    const liveGrowth = calcGrowth(liveThisMonth, liveLastMonth);



    // ------------------- Draft Projects ------------------
    const totalDraft = await this.prisma.project.count({
      where: { status: "DRAFT" },
    });

    const draftAddedItems = await this.prisma.project.findMany({
      where: { status: "DRAFT", createdAt: { gte: thisMonthStart } },
      orderBy: { createdAt: "desc" }
    });
    const draftThisMonth = draftAddedItems.length;

    const draftLastMonth = await this.prisma.project.count({
      where: { status: "DRAFT", createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });

    const draftUsersThisMonth = await this.prisma.projectEmployee.count({
      where: {
        assignedAt: { gte: thisMonthStart },
        project: { status: "DRAFT" }
      }
    });

    const draftGrowth = calcGrowth(draftThisMonth, draftLastMonth);



    // ------------------- Pending Review ------------------
    const totalPendingReview = await this.prisma.submitted.count({
      where: { status: "PENDING" }
    });

    const pendingAddedItems = await this.prisma.submitted.findMany({
      where: { status: "PENDING", createdAt: { gte: thisMonthStart } },
      orderBy: { createdAt: "desc" }
    });
    const pendingThisMonth = pendingAddedItems.length;

    const pendingLastMonth = await this.prisma.submitted.count({
      where: { status: "PENDING", createdAt: { gte: lastMonthStart, lt: thisMonthStart } },
    });

    const pendingUsersThisMonth = await this.prisma.submitted.count({
      where: {
        status: "PENDING",
        createdAt: { gte: thisMonthStart },
        employeeId: { not: null }
      }
    });

    const pendingGrowth = calcGrowth(pendingThisMonth, pendingLastMonth);



    // ------------------- Submit Overdue -------------------
    const totalOverdue = await this.prisma.project.count({
      where: { status: "OVERDUE" }
    });

    const overdueAddedItems = await this.prisma.project.findMany({
      // where: { status: "OVERDUE", createdAt: { gte: thisMonthStart } },
      where: { status: "OVERDUE", },
      orderBy: { createdAt: "desc" }
    });

    const submitOverdueUsersThisMonth = await this.prisma.projectEmployee.count({
      where: {
        assignedAt: { gte: thisMonthStart },
        project: { status: "OVERDUE" }
      }
    });

    const overduePercentage = totalProjects === 0
      ? 0
      : Number(((totalOverdue / totalProjects) * 100).toFixed(1));



    // ------------------- Return With Added Items ------------------
    return {
      programs: {
        total: totalPrograms,
        lastMonth: programsLastMonth,
        thisMonth: programsThisMonth,
        addedCount: programsThisMonth,
        addedItems: programsAddedItems,
        growth: programGrowth,
      },

      projects: {
        total: totalProjects,
        lastMonth: projectsLastMonth,
        thisMonth: projectsThisMonth,
        addedCount: projectsThisMonth,
        addedItems: projectsAddedItems,
        growth: projectGrowth,
      },

      liveProjects: {
        total: totalLive,
        lastMonth: liveLastMonth,
        thisMonth: liveThisMonth,
        addedCount: liveUsersThisMonth,
        addedItems: liveAddedItems,
        growth: liveGrowth,
      },

      draftProjects: {
        total: totalDraft,
        lastMonth: draftLastMonth,
        thisMonth: draftThisMonth,
        addedCount: draftUsersThisMonth,
        addedItems: draftAddedItems,
        growth: draftGrowth,
      },

      pendingReview: {
        total: totalPendingReview,
        lastMonth: pendingLastMonth,
        thisMonth: pendingThisMonth,
        addedCount: pendingUsersThisMonth,
        addedItems: pendingAddedItems,
        growth: pendingGrowth,
      },

      submitOverdue: {
        total: totalProjects,
        projectOverdue: totalOverdue,
        projectOverduePercentage: overduePercentage,
        addedCount: submitOverdueUsersThisMonth,
        addedItems: overdueAddedItems,
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

  // Project timeline service 
  async getProjectTimeline(programId?: string, maxDays?: number) {

    // If no programId is provided, get the first program
    if (!programId) {
      const firstProgram = await this.prisma.program.findFirst({
        // orderBy: { createdAt: 'asc' }
      });

      if (!firstProgram) {
        return { message: "No programs found" };
      }

      programId = firstProgram.id;
    }

    // Fetch all projects based on the programId
    const projects = await this.prisma.project.findMany({
      where: {
        programId
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        deadline: true,
        projectCompleteDate: true,
      }
    });

    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate completion time, overdue time, and saved time for each project
    const ProjectData = projects.map(p => {
      const start = p.startDate ? new Date(p.startDate).getTime() : null;
      const end = p.projectCompleteDate ? new Date(p.projectCompleteDate).getTime() : null;
      const estimated = p.deadline ? new Date(p.deadline).getTime() : null;

      let completionTime = 0;
      let overdueTime = 0;
      let savedTime = 0;

      // Calculate completion time
      if (start && end) {
        completionTime = Math.ceil((end - start) / ONE_DAY);
      }

      // Calculate overdue time (if project is completed after the deadline)
      if (estimated && end && end > estimated) {
        overdueTime = Math.ceil((end - estimated) / ONE_DAY);
      }

      // Calculate saved time (if project is completed before the deadline)
      if (estimated && end && end < estimated) {
        savedTime = Math.ceil((estimated - end) / ONE_DAY);
      }

      return {
        id: p.id,
        name: p.name,
        startDate: p.startDate,
        estimatedCompletedDate: p.deadline,
        project_end_Date: p.projectCompleteDate,
        completionTime,
        overdueTime,
        savedTime
      };
    });

    // Apply the filter:

    const filteredProjects = maxDays
      ? ProjectData.filter(item => item.overdueTime > 0 && item.overdueTime <= maxDays) // Show overdue projects with overdueTime <= maxDays
      : ProjectData;
    return {
      programId,
      maxDays,
      totalProjects: filteredProjects.length,
      ProjectData: filteredProjects
    };
  }






  //project status stack 
  async getProjectStatusStackGraph(period: 'week' | 'month' | 'year') {

    let dateFilter: any = {};
    const now = new Date();

    if (period === 'month') {
      dateFilter = {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      };
    }

    if (period === 'week') {
      const startWeek = new Date();
      const day = startWeek.getDay();
      startWeek.setDate(startWeek.getDate() - day + 1);
      startWeek.setHours(0, 0, 0, 0);

      const endWeek = new Date(startWeek);
      endWeek.setDate(startWeek.getDate() + 7);

      dateFilter = { gte: startWeek, lt: endWeek };
    }

    if (period === 'year') {
      dateFilter = {
        gte: new Date(now.getFullYear(), 0, 1),
        lt: new Date(now.getFullYear() + 1, 0, 1),
      };
    }


    const statusCount = await this.prisma.project.groupBy({
      by: ['status'],
      where: { createdAt: dateFilter },
      _count: { status: true }
    });


    const statusMap: Record<string, number> = {};
    statusCount.forEach(s => {
      statusMap[s.status] = s._count.status;
    });


    const totalProjects = Object.values(statusMap).reduce((a, b) => a + b, 0);

    const calcPercent = (count: number) =>
      totalProjects ? Number(((count / totalProjects) * 100).toFixed(2)) : 0;


    const inProgress = (statusMap['LIVE'] || 0) + (statusMap['DRAFT'] || 0);
    const completed = statusMap['COMPLETED'] || 0;
    const overdue = statusMap['OVERDUE'] || 0;
    const notStarted = statusMap['PENDING'] || 0;


    return {
      period,
      totalProjects,
      stack: {
        inProgress: { count: inProgress, percentage: calcPercent(inProgress) },
        completed: { count: completed, percentage: calcPercent(completed) },
        overdue: { count: overdue, percentage: calcPercent(overdue) },
        notStarted: { count: notStarted, percentage: calcPercent(notStarted) },
      }
    };

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
        overdue: `${overdueDays}`
      };
    });

    return {
      projects: result
    };
  }


  async getProjectsActivity() {
    const today = new Date();
    const ONE_DAY = 1000 * 60 * 60 * 24;

    const projects = await this.prisma.project.findMany({
      where: {
        status: "LIVE"
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
        const date = deadline.getTime() - today.getTime();
        const daysLeft = Math.ceil(date / ONE_DAY);

        return {
          programName: project.program?.programName ?? "No Program",
          projectId: project.id,
          projectName: project.name,
          deadline: project.deadline,
          daysLeft,
          assign_employees: project.projectEmployees.map(e => ({
            id: e.employee.id,
            name: e.employee.user?.name ?? "Unknown",
            profileImage: e.employee.user?.profileImage ?? null
          }))
        };
      })
      .filter(p => p.daysLeft <= 8 && p.daysLeft >= 0);

    return {
      total: filtered.length,
      projects: filtered
    };
  }

  async upcomingDeadlineProjects() {
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
      total: filtered.length,
      projects: filtered
    };
  }

async showAllSubmission(params: {
    startDate?: string;
    endDate?: string;
    status?: SubmittedStatus;
  }) {
    const { startDate, endDate, status } = params;

    return this.prisma.submitted.findMany({
      where: {
        ...(status && { status }),
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate && { gte: new Date(startDate) }),
                ...(endDate && { lte: new Date(endDate) }),
              },
            }
          : {}),
      },
      include: {
        employee: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        submissionReturn: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }





}

import { Injectable, NotFoundException } from "@nestjs/common";
import { startOfMonth, subMonths } from "date-fns";
import { ProjectStatus, SubmittedStatus } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ClientDashboardServices {
  constructor(private readonly prisma: PrismaService) { }

  async getDashboardOverview() {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    // ---------------- Growth Calculator ----------------
    const calcGrowth = (thisMonth: number, lastMonth: number) => {
      if (lastMonth === 0 && thisMonth === 0) return 0;
      if (lastMonth === 0) return 100;
      return Number((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1));
    };

    // common filter
    const baseWhere = { isDeleted: false };

    // ---------------- Programs ----------------
    const [totalPrograms, programsThisMonth, programsLastMonth, programsAddedItems] =
      await Promise.all([
        this.prisma.program.count(),

        this.prisma.program.count({
          where: { createdAt: { gte: thisMonthStart } },
        }),

        this.prisma.program.count({
          where: {
            createdAt: { gte: lastMonthStart, lt: thisMonthStart },
          },
        }),

        this.prisma.program.findMany({
          where: { createdAt: { gte: thisMonthStart } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);


    // ---------------- Projects ----------------
    const [totalProjects, projectsThisMonth, projectsLastMonth, projectsAddedItems] =
      await Promise.all([
        this.prisma.project.count({ where: baseWhere }),
        this.prisma.project.count({
          where: { ...baseWhere, createdAt: { gte: thisMonthStart } },
        }),
        this.prisma.project.count({
          where: {
            ...baseWhere,
            createdAt: { gte: lastMonthStart, lt: thisMonthStart },
          },
        }),
        this.prisma.project.findMany({
          where: { ...baseWhere, createdAt: { gte: thisMonthStart } },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    // ---------------- Live Projects ----------------
    const [totalLive, liveThisMonth, liveLastMonth, liveAddedItems, liveUsersThisMonth] =
      await Promise.all([
        this.prisma.project.count({
          where: { ...baseWhere, status: "LIVE" },
        }),
        this.prisma.project.count({
          where: {
            ...baseWhere,
            status: "LIVE",
            createdAt: { gte: thisMonthStart },
          },
        }),
        this.prisma.project.count({
          where: {
            ...baseWhere,
            status: "LIVE",
            createdAt: { gte: lastMonthStart, lt: thisMonthStart },
          },
        }),
        this.prisma.project.findMany({
          where: {
            ...baseWhere,
            status: "LIVE",
            createdAt: { gte: thisMonthStart },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        this.prisma.projectEmployee.count({
          where: {
            assignedAt: { gte: thisMonthStart },
            project: { status: "LIVE", isDeleted: false },
          },
        }),
      ]);

    // ---------------- Draft Projects ----------------
    const [totalDraft, draftThisMonth, draftLastMonth, draftAddedItems, draftUsersThisMonth] =
      await Promise.all([
        this.prisma.project.count({
          where: { ...baseWhere, status: "DRAFT" },
        }),
        this.prisma.project.count({
          where: {
            ...baseWhere,
            status: "DRAFT",
            createdAt: { gte: thisMonthStart },
          },
        }),
        this.prisma.project.count({
          where: {
            ...baseWhere,
            status: "DRAFT",
            createdAt: { gte: lastMonthStart, lt: thisMonthStart },
          },
        }),
        this.prisma.project.findMany({
          where: {
            ...baseWhere,
            status: "DRAFT",
            createdAt: { gte: thisMonthStart },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        this.prisma.projectEmployee.count({
          where: {
            assignedAt: { gte: thisMonthStart },
            project: { status: "DRAFT", isDeleted: false },
          },
        }),
      ]);

    // ---------------- Pending Review ----------------
    const [
      totalPendingReview,
      pendingThisMonth,
      pendingLastMonth,
      pendingAddedItems,
      pendingUsersThisMonth,
    ] = await Promise.all([
      this.prisma.submitted.count({
        where: { status: "PENDING" },
      }),
      this.prisma.submitted.count({
        where: {
          status: "PENDING",
          createdAt: { gte: thisMonthStart },
        },
      }),
      this.prisma.submitted.count({
        where: {
          status: "PENDING",
          createdAt: { gte: lastMonthStart, lt: thisMonthStart },
        },
      }),
      this.prisma.submitted.findMany({
        where: {
          status: "PENDING",
          createdAt: { gte: thisMonthStart },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      this.prisma.submitted.count({
        where: {
          status: "PENDING",
          createdAt: { gte: thisMonthStart },
          employeeId: { not: null },
        },
      }),
    ]);

    // ---------------- Overdue Projects ----------------
    const [totalOverdue, overdueAddedItems, submitOverdueUsersThisMonth] =
      await Promise.all([
        this.prisma.project.count({
          where: { ...baseWhere, status: "OVERDUE" },
        }),
        this.prisma.project.findMany({
          where: { ...baseWhere, status: "OVERDUE" },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        this.prisma.projectEmployee.count({
          where: {
            assignedAt: { gte: thisMonthStart },
            project: { status: "OVERDUE", isDeleted: false },
          },
        }),
      ]);

    const overduePercentage =
      totalProjects === 0
        ? 0
        : Number(((totalOverdue / totalProjects) * 100).toFixed(1));

    // ---------------- Final Response ----------------
    return {
      programs: {
        total: totalPrograms,
        thisMonth: programsThisMonth,
        lastMonth: programsLastMonth,
        addedCount: programsThisMonth,
        addedItems: programsAddedItems,
        growth: calcGrowth(programsThisMonth, programsLastMonth),
      },

      projects: {
        total: totalProjects,
        thisMonth: projectsThisMonth,
        lastMonth: projectsLastMonth,
        addedCount: projectsThisMonth,
        addedItems: projectsAddedItems,
        growth: calcGrowth(projectsThisMonth, projectsLastMonth),
      },

      liveProjects: {
        total: totalLive,
        thisMonth: liveThisMonth,
        lastMonth: liveLastMonth,
        addedCount: liveUsersThisMonth,
        addedItems: liveAddedItems,
        growth: calcGrowth(liveThisMonth, liveLastMonth),
      },

      draftProjects: {
        total: totalDraft,
        thisMonth: draftThisMonth,
        lastMonth: draftLastMonth,
        addedCount: draftUsersThisMonth,
        addedItems: draftAddedItems,
        growth: calcGrowth(draftThisMonth, draftLastMonth),
      },

      pendingReview: {
        total: totalPendingReview,
        thisMonth: pendingThisMonth,
        lastMonth: pendingLastMonth,
        addedCount: pendingUsersThisMonth,
        addedItems: pendingAddedItems,
        growth: calcGrowth(pendingThisMonth, pendingLastMonth),
      },

      submitOverdue: {
        total: totalProjects,
        projectOverdue: totalOverdue,
        projectOverduePercentage: overduePercentage,
        addedCount: submitOverdueUsersThisMonth,
        addedItems: overdueAddedItems,
      },
    };
  }



  //employees activity
  async getEmployeesActivity(
    userId?: string,
    startDate?: Date,
    endDate?: Date,
    search?: string, // new search parameter
    limit: number = 10,
    skip: number = 0,
  ) {
    const where: any = {};

    // Filter by userId
    if (userId) {
      where.userId = userId;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    // Search by user name or project name
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { project: { name: { contains: search, mode: "insensitive" } } },
      ];
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
      user: {
        id: a.user?.id ?? null,
        name: a.user?.name ?? "unknown user",
        profileImage: a.user?.profileImage ?? null,
      },
      description: a.description,
      projectName: a.project?.name ?? "unknown project",
      projectId: a.projectId,
      ipAddress: a.ipAddress,
      actionType: a.actionType,
      metadata: a.metadata,
    }));


    return { result };
  }




  async getProjectTimeline(
    programId?: string,
    maxOverdueDays?: number,
    maxSavedDays?: number,
    status?: ProjectStatus | ProjectStatus[],
  ) {
    if (!programId) {
      const firstProgram = await this.prisma.program.findFirst();
      if (!firstProgram) return { message: 'No programs found' };
      programId = firstProgram.id;
    }

    const allowedStatuses = [ProjectStatus.COMPLETED, ProjectStatus.LIVE] as const;
    const statusArray = status
      ? (Array.isArray(status) ? status : [status]).filter(
        (s): s is typeof allowedStatuses[number] =>
          allowedStatuses.includes(s as typeof allowedStatuses[number])
      )
      : [...allowedStatuses];

    const projects = await this.prisma.project.findMany({
      where: {
        programId,
        status: { in: statusArray },
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        deadline: true,
        projectCompleteDate: true,
        status: true,
      },
    });

    const ONE_DAY = 1000 * 60 * 60 * 24;
    const today = new Date();

    const projectData = projects.map((p) => {
      const trackable = Boolean(p.startDate && p.deadline);
      const start = p.startDate?.getTime() ?? 0;
      const deadline = p.deadline?.getTime() ?? 0;
      const endDate = p.projectCompleteDate ?? today;
      const end = endDate.getTime();

      const timelineDays = trackable ? Math.max(0, Math.ceil((end - start) / ONE_DAY)) : 0;

      let savedDays = 0;
      let overdueDays = 0;
      if (trackable) {
        if (end < deadline) savedDays = Math.ceil((deadline - end) / ONE_DAY);
        else if (end > deadline) overdueDays = Math.ceil((end - deadline) / ONE_DAY);
      }

      return {
        id: p.id,
        name: p.name,
        startDate: p.startDate,
        deadline: p.deadline,
        projectEndDate: p.projectCompleteDate,
        timelineDays,
        savedDays,
        overdueDays,
        trackable,
        status: p.status,
      };
    });

    let filteredProjects = projectData;
    if (maxOverdueDays !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.overdueDays > 0 && p.overdueDays <= maxOverdueDays,
      );
    }

    if (maxSavedDays !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.savedDays > 0 && p.savedDays <= maxSavedDays,
      );
    }

    return {
      programId,
      filters: { status: statusArray, maxOverdueDays, maxSavedDays },
      totalProjects: filteredProjects.length,
      projects: filteredProjects,
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
    const today = new Date();
    const projects = await this.prisma.project.findMany({
      where: {
        status: "OVERDUE",
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        deadline: true,
        projectCompleteDate: true,
        status: true,
      },
    });

    // Map projects to calculate overdue days
    const result = projects.map((project) => {
      let overdueDays = 0;

      if (project.deadline) {
        const deadline = new Date(project.deadline);
        const endDate = project.projectCompleteDate
          ? new Date(project.projectCompleteDate)
          : today;

        if (endDate > deadline) {
          overdueDays = Math.floor(
            (endDate.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
      }

      return {
        ...project,
        overdueDays,
        trackable: Boolean(project.startDate && project.deadline),
      };
    });

    return {
      totalProjects: result.length,
      projects: result,
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
        const deadline = new Date(project.deadline as any);
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
        isDeleted: false,
        deadline: { not: null },
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        program: { select: { programName: true } },
        projectEmployees: {
          select: {
            employee: {
              select: {
                id: true,
                user: { select: { name: true, profileImage: true } }
              }
            }
          }
        }
      }
    });

    const filtered = projects
      .map(project => {
        if (!project.deadline) return null; 

        const deadline = new Date(project.deadline);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / ONE_DAY);

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
      .filter((p): p is NonNullable<typeof p> => p !== null && p.daysLeft >= 0 && p.daysLeft <= 8)
      .sort((a, b) => a.daysLeft - b.daysLeft); 

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
          select: {
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

  async updateStatus(id: string, status: SubmittedStatus) {
    const submitted = await this.prisma.submitted.findUnique({
      where: { id },
    });

    if (!submitted) {
      throw new NotFoundException('Submission not found');
    }

    return this.prisma.submitted.update({
      where: { id },
      data: { status },
    });
  }



}

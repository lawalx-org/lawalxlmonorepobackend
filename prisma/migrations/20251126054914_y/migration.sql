-- CreateEnum
CREATE TYPE "ChartStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEPRECATED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ChartName" AS ENUM ('BAR', 'LINE', 'PIE', 'DOUGHNUT', 'RADAR', 'POLAR_AREA', 'BUBBLE', 'SCATTER', 'AREA', 'MIXED', 'GAUGE', 'FUNNEL', 'TREEMAP', 'SUNBURST', 'SANKEY', 'TABLE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VIEWER', 'EMPLOYEE', 'SUPPORTER', 'MANAGER', 'ADMIN', 'CLIENT', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'HALFYEARLY', 'YEARLY', 'TWOYEARLY', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "IndustryCategory" AS ENUM ('REALESTATE', 'FINANCE', 'RENEWABLE_ENERGY', 'TRAVEL_AGENCY', 'BEAUTY_AND_WELLNESS');

-- CreateEnum
CREATE TYPE "SupporterRole" AS ENUM ('CALLATTENDANCE', 'SUPPORTMANAGER', 'SALESOFFICER', 'SYSTEMENGINEER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'NORMAL');

-- CreateEnum
CREATE TYPE "ProjectCycle" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'LIVE', 'DRAFT', 'OVERDUE', 'PROBLEM', 'COMPLETED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('INPROGRESS', 'COMPLETED', 'OVERDUE', 'NOSTART');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'UNASSIGNED', 'IN_PROGRESS', 'SOLVED');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('LOGINFAILED', 'SYSTEMERROR', 'OTHERPROBLEM');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED', 'DELETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ActivityActionType" AS ENUM ('ASSIGNEE_ADDED', 'ASSIGNEE_REMOVED', 'FILE_ADDED', 'FILE_REMOVED', 'LINK_ADDED', 'LINK_REMOVED', 'DUE_DATE_CHANGED', 'PROGRESS_CHANGED', 'SUBTASK_ADDED', 'SUBTASK_REMOVED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'COMMENT_ADDED', 'PROJECT_CREATED', 'PROJECT_UPDATED', 'TASK_CREATED', 'TASK_COMPLETED', 'GENERAL');

-- CreateEnum
CREATE TYPE "SubmittedStatus" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_EMPLOYEE_ASSIGNED', 'NEW_MANAGER_ASSIGNED');

-- CreateEnum
CREATE TYPE "RepeatInterval" AS ENUM ('WEEKLY', 'BI_WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "actionType" "ActivityActionType" NOT NULL DEFAULT 'GENERAL',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "contactPersonName" TEXT,
    "clientLogo" TEXT,
    "favicon" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "footerText" TEXT,
    "supportMail" TEXT,
    "subdomain" TEXT,
    "serverLocation" TEXT,
    "category" "IndustryCategory" NOT NULL DEFAULT 'REALESTATE',
    "onboarding" BOOLEAN NOT NULL DEFAULT false,
    "welcomeDashboard" BOOLEAN NOT NULL DEFAULT false,
    "chartList" TEXT[],
    "storage" TEXT,
    "threshold" INTEGER,
    "archiveAfter" INTEGER,
    "userWarning" BOOLEAN NOT NULL DEFAULT false,
    "adminNote" TEXT,
    "trialPeriod" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "joinedDate" TEXT NOT NULL,
    "skills" TEXT[],

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "joinedDate" TEXT NOT NULL,

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverIds" TEXT[],
    "projectId" TEXT,
    "context" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_provisions" (
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "notification_provisions_pkey" PRIMARY KEY ("userId","notificationId")
);

-- CreateTable
CREATE TABLE "notification_permissions_employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "returnProject" BOOLEAN NOT NULL DEFAULT true,
    "assignNewProject" BOOLEAN NOT NULL DEFAULT true,
    "projectPublish" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_permissions_manager" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileImportByEmployees" BOOLEAN NOT NULL DEFAULT true,
    "weeklySummary" BOOLEAN NOT NULL DEFAULT true,
    "createNewProject" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_permissions_client" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "onProjectApproval" BOOLEAN NOT NULL DEFAULT true,
    "onProjectRejection" BOOLEAN NOT NULL DEFAULT true,
    "fileImportByEmployees" BOOLEAN NOT NULL DEFAULT true,
    "weeklySummary" BOOLEAN NOT NULL DEFAULT true,
    "storageLimit" BOOLEAN NOT NULL DEFAULT true,
    "billPayment" BOOLEAN NOT NULL DEFAULT true,
    "overdueProject" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_permissions_supporter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignNewProject" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_supporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_permissions_admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storageLimit" BOOLEAN NOT NULL DEFAULT true,
    "receivedPayment" BOOLEAN NOT NULL DEFAULT true,
    "createClient" BOOLEAN NOT NULL DEFAULT true,
    "createTicket" BOOLEAN NOT NULL DEFAULT true,
    "paymentCycleChange" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_permissions_super_admin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storageLimit" BOOLEAN NOT NULL DEFAULT true,
    "receivedPayment" BOOLEAN NOT NULL DEFAULT true,
    "createClient" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_permissions_super_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programName" TEXT NOT NULL,
    "datetime" TEXT NOT NULL,
    "programDescription" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "deadline" TEXT NOT NULL,
    "progress" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "managerId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "progress" INTEGER,
    "chartList" TEXT[],
    "estimatedCompletedDate" TIMESTAMP(3),
    "projectCompleteDate" TIMESTAMP(3),
    "currentRate" TEXT,
    "budget" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_employees" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "taskAssignId" TEXT,
    "status" "ProjectStatus" NOT NULL,
    "managerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_returns" (
    "id" TEXT NOT NULL,
    "submittedId" TEXT NOT NULL,
    "returnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_returns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submitted" (
    "id" TEXT NOT NULL,
    "information" TEXT NOT NULL,
    "submission" TEXT NOT NULL,
    "status" "SubmittedStatus" NOT NULL DEFAULT 'PENDING',
    "employeeId" TEXT,
    "projectId" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "submiteCells" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submitted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "clientLogo" TEXT,
    "favicon" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "super_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supporters" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "supporterRole" "SupporterRole" NOT NULL,
    "skills" TEXT[],
    "workload" INTEGER,
    "workItems" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supporters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "status" "TaskStatus",
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "progress" INTEGER,
    "dueDate" TEXT,
    "assignedTo" TEXT NOT NULL,
    "assigneeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "supporterIds" TEXT[],
    "adminIds" TEXT[],
    "companyName" TEXT,
    "subject" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "Priority" NOT NULL,
    "issue" TEXT NOT NULL,
    "adminNote" TEXT,
    "attachFile" TEXT,
    "issueType" "IssueType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "profileImage" TEXT,
    "language" "Language" NOT NULL DEFAULT 'ENGLISH',
    "timezone" TIMESTAMP(3),
    "verification2FA" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "lastActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userStatus" "UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "clientId" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("clientId")
);

-- CreateTable
CREATE TABLE "referred_persons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" INTEGER,
    "aboutThere" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referred_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_to_add_project_members" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "projectId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_to_add_project_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viewers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartTable" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ChartStatus" NOT NULL,
    "category" "ChartName" NOT NULL,
    "xAxis" JSONB NOT NULL,
    "yAxis" JSONB NOT NULL,
    "zAxis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sheetId" TEXT,

    CONSTRAINT "ChartTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "nextTriggerAt" TIMESTAMP(3),
    "repeatEvery" "RepeatInterval",
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "repeatOnDays" "DayOfWeek"[],
    "repeatOnDates" INTEGER[],
    "remindBefore" INTEGER,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Sheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SheetSnapshot" (
    "id" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SheetSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submiteCell" (
    "id" TEXT NOT NULL,
    "row" INTEGER NOT NULL,
    "col" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "sheetId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submiteCell_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_userId_key" ON "clients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "otp_verifications_email_key" ON "otp_verifications"("email");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "managers_userId_key" ON "managers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_employee_userId_key" ON "notification_permissions_employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_manager_userId_key" ON "notification_permissions_manager"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_client_userId_key" ON "notification_permissions_client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_supporter_userId_key" ON "notification_permissions_supporter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_admin_userId_key" ON "notification_permissions_admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_permissions_super_admin_userId_key" ON "notification_permissions_super_admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_employees_projectId_employeeId_key" ON "project_employees"("projectId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "submission_returns_submittedId_key" ON "submission_returns"("submittedId");

-- CreateIndex
CREATE UNIQUE INDEX "super_admins_userId_key" ON "super_admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "supporters_userId_key" ON "supporters"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "viewers_userId_key" ON "viewers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_sheetId_key" ON "ChartTable"("sheetId");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_projectId_chartId_key" ON "Sheet"("projectId", "chartId");

-- CreateIndex
CREATE UNIQUE INDEX "Cell_sheetId_row_col_key" ON "Cell"("sheetId", "row", "col");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_verifications" ADD CONSTRAINT "otp_verifications_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_provisions" ADD CONSTRAINT "notification_provisions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_provisions" ADD CONSTRAINT "notification_provisions_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_permissions_employee" ADD CONSTRAINT "notification_permissions_employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_permissions_manager" ADD CONSTRAINT "notification_permissions_manager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_permissions_client" ADD CONSTRAINT "notification_permissions_client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_permissions_supporter" ADD CONSTRAINT "notification_permissions_supporter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_permissions_admin" ADD CONSTRAINT "notification_permissions_admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_permissions_super_admin" ADD CONSTRAINT "notification_permissions_super_admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "super_admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_employees" ADD CONSTRAINT "project_employees_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_employees" ADD CONSTRAINT "project_employees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_returns" ADD CONSTRAINT "submission_returns_submittedId_fkey" FOREIGN KEY ("submittedId") REFERENCES "Submitted"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submitted" ADD CONSTRAINT "Submitted_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submitted" ADD CONSTRAINT "Submitted_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super_admins" ADD CONSTRAINT "super_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporters" ADD CONSTRAINT "supporters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referred_persons" ADD CONSTRAINT "referred_persons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_to_add_project_members" ADD CONSTRAINT "request_to_add_project_members_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_to_add_project_members" ADD CONSTRAINT "request_to_add_project_members_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewers" ADD CONSTRAINT "viewers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChartTable" ADD CONSTRAINT "ChartTable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SheetSnapshot" ADD CONSTRAINT "SheetSnapshot_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

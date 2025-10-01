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
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'LIVE', 'DRAFT', 'OVERDUE', 'PROBLEM');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('INPROGRESS', 'COMPLETED', 'OVERDUE', 'NOSTART');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'UNASSIGNED', 'IN_PROGRESS', 'SOLVED');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('LOGINFAILED', 'SYSTEMERROR', 'OTHERPROBLEM');

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "senderIds" TEXT[],
    "receiverIds" TEXT[],
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
    "priority" TEXT NOT NULL,
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
    "datetime" TIMESTAMP(3),
    "uploadCycle" "ProjectCycle" NOT NULL,
    "description" TEXT NOT NULL,
    "dataReceivedTime" TEXT,
    "beforeSubmitData" INTEGER,
    "importFiles" TEXT[],
    "importMainFile" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "Priority" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "managerId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "progress" INTEGER,
    "chartList" TEXT[],
    "estimatedCompletedDate" TIMESTAMP(3),
    "currentRate" TEXT,
    "budget" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "super_admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "userId" TEXT NOT NULL,
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
    "phoneNumber" INTEGER,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "otp" INTEGER,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "profileImage" TEXT,
    "language" "Language" NOT NULL DEFAULT 'ENGLISH',
    "timezone" TIMESTAMP(3),
    "verification2FA" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "lastActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viewers_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "super_admins_userId_key" ON "super_admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "supporters_userId_key" ON "supporters"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "viewers_userId_key" ON "viewers"("userId");

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_verifications" ADD CONSTRAINT "otp_verifications_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super_admins" ADD CONSTRAINT "super_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporters" ADD CONSTRAINT "supporters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "viewers" ADD CONSTRAINT "viewers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewers" ADD CONSTRAINT "viewers_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

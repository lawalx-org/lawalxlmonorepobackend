-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_employeeId_fkey";

-- CreateTable
CREATE TABLE "project_employees" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_employees_projectId_employeeId_key" ON "project_employees"("projectId", "employeeId");

-- AddForeignKey
ALTER TABLE "project_employees" ADD CONSTRAINT "project_employees_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_employees" ADD CONSTRAINT "project_employees_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

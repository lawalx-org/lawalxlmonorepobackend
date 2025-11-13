/*
  Warnings:

  - A unique constraint covering the columns `[chartId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chartId` to the `Sheet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submitted" DROP CONSTRAINT "Submitted_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_userId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_userId_fkey";

-- DropForeignKey
ALTER TABLE "managers" DROP CONSTRAINT "managers_userId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropForeignKey
ALTER TABLE "super_admins" DROP CONSTRAINT "super_admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "supporters" DROP CONSTRAINT "supporters_userId_fkey";

-- DropForeignKey
ALTER TABLE "viewers" DROP CONSTRAINT "viewers_userId_fkey";

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "chartId" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submitted" ALTER COLUMN "employeeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "managers" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "super_admins" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "supporters" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "viewers" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_chartId_key" ON "Sheet"("chartId");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_projectId_key" ON "Sheet"("projectId");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submitted" ADD CONSTRAINT "Submitted_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super_admins" ADD CONSTRAINT "super_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supporters" ADD CONSTRAINT "supporters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewers" ADD CONSTRAINT "viewers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sheet" ADD CONSTRAINT "Sheet_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `infrastructureProjectId` on the `InfrastructureNode` table. All the data in the column will be lost.
  - You are about to drop the `InfrastructureProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InfrastructureProjectSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AssignedProject` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `InfrastructureNode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."InfrastructureNode" DROP CONSTRAINT "InfrastructureNode_infrastructureProjectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AssignedProject" DROP CONSTRAINT "_AssignedProject_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AssignedProject" DROP CONSTRAINT "_AssignedProject_B_fkey";

-- DropIndex
DROP INDEX "public"."InfrastructureNode_infrastructureProjectId_idx";

-- AlterTable
ALTER TABLE "public"."InfrastructureNode" DROP COLUMN "infrastructureProjectId",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "computedProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "slug" TEXT;

-- DropTable
DROP TABLE "public"."InfrastructureProject";

-- DropTable
DROP TABLE "public"."InfrastructureProjectSnapshot";

-- DropTable
DROP TABLE "public"."_AssignedProject";

-- CreateIndex
CREATE INDEX "InfrastructureNode_projectId_idx" ON "public"."InfrastructureNode"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "public"."projects"("slug");

-- CreateIndex
CREATE INDEX "projects_programId_idx" ON "public"."projects"("programId");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "public"."projects"("slug");

-- CreateIndex
CREATE INDEX "projects_managerId_idx" ON "public"."projects"("managerId");

-- CreateIndex
CREATE INDEX "projects_viewerId_idx" ON "public"."projects"("viewerId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "public"."projects"("status");

-- CreateIndex
CREATE INDEX "projects_priority_idx" ON "public"."projects"("priority");

-- CreateIndex
CREATE INDEX "projects_deadline_idx" ON "public"."projects"("deadline");

-- CreateIndex
CREATE INDEX "projects_estimatedCompletedDate_idx" ON "public"."projects"("estimatedCompletedDate");

-- CreateIndex
CREATE INDEX "projects_projectCompleteDate_idx" ON "public"."projects"("projectCompleteDate");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "public"."projects"("createdAt");

-- CreateIndex
CREATE INDEX "projects_updatedAt_idx" ON "public"."projects"("updatedAt");

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

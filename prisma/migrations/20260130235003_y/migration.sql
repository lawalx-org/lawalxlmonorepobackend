/*
  Warnings:

  - You are about to drop the column `estimatedCompletedDate` on the `projects` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."projects_estimatedCompletedDate_idx";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "estimatedCompletedDate",
ADD COLUMN     "deadline" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "projects_deadline_idx" ON "public"."projects"("deadline");

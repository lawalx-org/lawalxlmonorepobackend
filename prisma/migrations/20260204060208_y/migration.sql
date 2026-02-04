/*
  Warnings:

  - The `repeatEvery` column on the `Reminder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."Reminder" DROP CONSTRAINT "Reminder_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."Reminder" DROP COLUMN "repeatEvery",
ADD COLUMN     "repeatEvery" "public"."UploadCycle";

-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "uploadCycle" "public"."UploadCycle";

-- DropEnum
DROP TYPE "public"."RepeatInterval";

-- CreateIndex
CREATE INDEX "Reminder_projectId_idx" ON "public"."Reminder"("projectId");

-- CreateIndex
CREATE INDEX "Reminder_nextTriggerAt_idx" ON "public"."Reminder"("nextTriggerAt");

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

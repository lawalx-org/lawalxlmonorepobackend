/*
  Warnings:

  - You are about to drop the column `projectId` on the `ChartTableProgramBuilder` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ChartTableProgramBuilder" DROP CONSTRAINT "ChartTableProgramBuilder_projectId_fkey";

-- AlterTable
ALTER TABLE "public"."ChartTableProgramBuilder" DROP COLUMN "projectId",
ADD COLUMN     "programid" TEXT;

-- AddForeignKey
ALTER TABLE "public"."ChartTableProgramBuilder" ADD CONSTRAINT "ChartTableProgramBuilder_programid_fkey" FOREIGN KEY ("programid") REFERENCES "public"."programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

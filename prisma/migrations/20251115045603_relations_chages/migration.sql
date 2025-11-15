/*
  Warnings:

  - A unique constraint covering the columns `[sheetId]` on the table `ChartTable` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,chartId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Sheet" DROP CONSTRAINT "Sheet_chartId_fkey";

-- DropIndex
DROP INDEX "public"."Sheet_chartId_key";

-- DropIndex
DROP INDEX "public"."Sheet_projectId_key";

-- AlterTable
ALTER TABLE "ChartTable" ADD COLUMN     "sheetId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_sheetId_key" ON "ChartTable"("sheetId");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_projectId_chartId_key" ON "Sheet"("projectId", "chartId");

-- AddForeignKey
ALTER TABLE "ChartTable" ADD CONSTRAINT "ChartTable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

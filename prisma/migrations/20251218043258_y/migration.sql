/*
  Warnings:

  - You are about to drop the column `chartId` on the `Sheet` table. All the data in the column will be lost.
  - You are about to drop the `ChartTable` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stackBarChartId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."ChartTable" DROP CONSTRAINT "ChartTable_sheetId_fkey";

-- DropIndex
DROP INDEX "public"."Sheet_projectId_chartId_key";

-- AlterTable
ALTER TABLE "public"."Sheet" DROP COLUMN "chartId",
ADD COLUMN     "stackBarChartId" INTEGER;

-- DropTable
DROP TABLE "public"."ChartTable";

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_stackBarChartId_key" ON "public"."Sheet"("stackBarChartId");

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_projectId_key" ON "public"."Sheet"("projectId");

-- AddForeignKey
ALTER TABLE "public"."Sheet" ADD CONSTRAINT "Sheet_stackBarChartId_fkey" FOREIGN KEY ("stackBarChartId") REFERENCES "public"."StackBarChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

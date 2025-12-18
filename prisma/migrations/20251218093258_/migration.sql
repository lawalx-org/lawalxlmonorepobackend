/*
  Warnings:

  - You are about to drop the column `barChartId` on the `ChartTable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ChartTableId]` on the table `barChart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ChartTableId` to the `barChart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ChartTable" DROP CONSTRAINT "ChartTable_barChartId_fkey";

-- DropIndex
DROP INDEX "public"."ChartTable_barChartId_key";

-- AlterTable
ALTER TABLE "public"."ChartTable" DROP COLUMN "barChartId";

-- AlterTable
ALTER TABLE "public"."barChart" ADD COLUMN     "ChartTableId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "barChart_ChartTableId_key" ON "public"."barChart"("ChartTableId");

-- AddForeignKey
ALTER TABLE "public"."barChart" ADD CONSTRAINT "barChart_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

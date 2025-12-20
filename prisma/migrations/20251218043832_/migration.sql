/*
  Warnings:

  - You are about to drop the column `stackBarChartId` on the `Sheet` table. All the data in the column will be lost.
  - You are about to drop the `ShowWidget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StackBarChart` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId,chartId]` on the table `Sheet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chartId` to the `Sheet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Sheet" DROP CONSTRAINT "Sheet_stackBarChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidget" DROP CONSTRAINT "ShowWidget_stackBarChartId_fkey";

-- DropIndex
DROP INDEX "public"."Sheet_projectId_key";

-- DropIndex
DROP INDEX "public"."Sheet_stackBarChartId_key";

-- AlterTable
ALTER TABLE "public"."Sheet" DROP COLUMN "stackBarChartId",
ADD COLUMN     "chartId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."ShowWidget";

-- DropTable
DROP TABLE "public"."StackBarChart";

-- CreateIndex
CREATE UNIQUE INDEX "Sheet_projectId_chartId_key" ON "public"."Sheet"("projectId", "chartId");

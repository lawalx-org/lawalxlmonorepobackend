/*
  Warnings:

  - You are about to drop the column `piId` on the `ChartTable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chartTableId]` on the table `Pi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chartTableId` to the `Pi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ChartTable" DROP CONSTRAINT "ChartTable_piId_fkey";

-- AlterTable
ALTER TABLE "public"."ChartTable" DROP COLUMN "piId";

-- AlterTable
ALTER TABLE "public"."Pi" ADD COLUMN     "chartTableId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pi_chartTableId_key" ON "public"."Pi"("chartTableId");

-- AddForeignKey
ALTER TABLE "public"."Pi" ADD CONSTRAINT "Pi_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

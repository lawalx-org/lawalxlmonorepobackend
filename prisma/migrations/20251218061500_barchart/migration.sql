/*
  Warnings:

  - A unique constraint covering the columns `[barChartId]` on the table `ChartTable` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."ChartTable" ADD COLUMN     "barChartId" TEXT;

-- CreateTable
CREATE TABLE "public"."barChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidget" (
    "id" SERIAL NOT NULL,
    "legend_name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barChartId" TEXT NOT NULL,

    CONSTRAINT "ShowWidget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_barChartId_key" ON "public"."ChartTable"("barChartId");

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_barChartId_fkey" FOREIGN KEY ("barChartId") REFERENCES "public"."barChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidget" ADD CONSTRAINT "ShowWidget_barChartId_fkey" FOREIGN KEY ("barChartId") REFERENCES "public"."barChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

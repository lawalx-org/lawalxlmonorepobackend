/*
  Warnings:

  - You are about to drop the column `programId` on the `ChartTable` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfDataset_X` on the `HeatMapChart` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfDataset_Y` on the `HeatMapChart` table. All the data in the column will be lost.
  - Added the required column `numberOfDataset` to the `HeatMapChart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ShowWidgetHeatMap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ChartTable" DROP CONSTRAINT "ChartTable_programId_fkey";

-- AlterTable
ALTER TABLE "public"."ChartTable" DROP COLUMN "programId",
ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "public"."HeatMapChart" DROP COLUMN "numberOfDataset_X",
DROP COLUMN "numberOfDataset_Y",
ADD COLUMN     "numberOfDataset" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Pi" ADD COLUMN     "firstFieldDataset" INTEGER,
ADD COLUMN     "lastFieldDataset" INTEGER;

-- AlterTable
ALTER TABLE "public"."ShowWidgetHeatMap" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."AreaChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "AreaChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetArea" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "areaId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MultiAxisChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "MultiAxisChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetMultiAxis" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "multiAxisId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetMultiAxis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ColumnChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ColumnChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetColumn" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "columnChartId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StackedBarChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "StackedBarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetStackedBarChart" (
    "id" SERIAL NOT NULL,
    "legend_name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stackedBarChartId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetStackedBarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoughnutChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "DoughnutChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetDoughnut" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "DoughnutId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetDoughnut_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParetoChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "Left_firstFieldDataset" INTEGER NOT NULL,
    "Left_lastFieldDataset" INTEGER NOT NULL,
    "Right_firstFieldDataset" INTEGER NOT NULL,
    "Right_lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ParetoChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetParetoChart" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paretoChartId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetParetoChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistogramChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HistogramChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetHistogram" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "histogramId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetHistogram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScatterChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ScatterChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetScatter" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scatterId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetScatter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolidGaugeChart" (
    "id" TEXT NOT NULL,
    "startingRange" INTEGER NOT NULL,
    "endRange" INTEGER NOT NULL,
    "gaugeValue" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "chartHight" INTEGER NOT NULL,
    "startAngle" INTEGER NOT NULL,
    "endAngle" INTEGER NOT NULL,
    "trackColor" TEXT NOT NULL,
    "strokeWidth" INTEGER NOT NULL,
    "valueFontSize" INTEGER NOT NULL,
    "shadeIntensity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "SolidGaugeChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetSolidGauge" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gaugeId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetSolidGauge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunnelChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "FunnelChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetFunnel" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "funnelId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetFunnel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WaterFallChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "WaterFallChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetWaterFall" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "waterFallId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetWaterFall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandlestickChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "CandlestickChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetCandlestick" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "candlestickId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetCandlestick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RadarChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "RadarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetRadar" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "radarId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetRadar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AreaChart_chartTableId_key" ON "public"."AreaChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "MultiAxisChart_chartTableId_key" ON "public"."MultiAxisChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ColumnChart_chartTableId_key" ON "public"."ColumnChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "StackedBarChart_ChartTableId_key" ON "public"."StackedBarChart"("ChartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "DoughnutChart_chartTableId_key" ON "public"."DoughnutChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ParetoChart_chartTableId_key" ON "public"."ParetoChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HistogramChart_chartTableId_key" ON "public"."HistogramChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ScatterChart_chartTableId_key" ON "public"."ScatterChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "SolidGaugeChart_chartTableId_key" ON "public"."SolidGaugeChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "FunnelChart_chartTableId_key" ON "public"."FunnelChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterFallChart_chartTableId_key" ON "public"."WaterFallChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "CandlestickChart_chartTableId_key" ON "public"."CandlestickChart"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "RadarChart_chartTableId_key" ON "public"."RadarChart"("chartTableId");

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AreaChart" ADD CONSTRAINT "AreaChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetArea" ADD CONSTRAINT "ShowWidgetArea_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."AreaChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiAxisChart" ADD CONSTRAINT "MultiAxisChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetMultiAxis" ADD CONSTRAINT "ShowWidgetMultiAxis_multiAxisId_fkey" FOREIGN KEY ("multiAxisId") REFERENCES "public"."MultiAxisChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ColumnChart" ADD CONSTRAINT "ColumnChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetColumn" ADD CONSTRAINT "ShowWidgetColumn_columnChartId_fkey" FOREIGN KEY ("columnChartId") REFERENCES "public"."ColumnChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackedBarChart" ADD CONSTRAINT "StackedBarChart_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetStackedBarChart" ADD CONSTRAINT "ShowWidgetStackedBarChart_stackedBarChartId_fkey" FOREIGN KEY ("stackedBarChartId") REFERENCES "public"."StackedBarChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoughnutChart" ADD CONSTRAINT "DoughnutChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetDoughnut" ADD CONSTRAINT "ShowWidgetDoughnut_DoughnutId_fkey" FOREIGN KEY ("DoughnutId") REFERENCES "public"."DoughnutChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParetoChart" ADD CONSTRAINT "ParetoChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetParetoChart" ADD CONSTRAINT "ShowWidgetParetoChart_paretoChartId_fkey" FOREIGN KEY ("paretoChartId") REFERENCES "public"."ParetoChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistogramChart" ADD CONSTRAINT "HistogramChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetHistogram" ADD CONSTRAINT "ShowWidgetHistogram_histogramId_fkey" FOREIGN KEY ("histogramId") REFERENCES "public"."HistogramChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScatterChart" ADD CONSTRAINT "ScatterChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetScatter" ADD CONSTRAINT "ShowWidgetScatter_scatterId_fkey" FOREIGN KEY ("scatterId") REFERENCES "public"."ScatterChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolidGaugeChart" ADD CONSTRAINT "SolidGaugeChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetSolidGauge" ADD CONSTRAINT "ShowWidgetSolidGauge_gaugeId_fkey" FOREIGN KEY ("gaugeId") REFERENCES "public"."SolidGaugeChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FunnelChart" ADD CONSTRAINT "FunnelChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetFunnel" ADD CONSTRAINT "ShowWidgetFunnel_funnelId_fkey" FOREIGN KEY ("funnelId") REFERENCES "public"."FunnelChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WaterFallChart" ADD CONSTRAINT "WaterFallChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetWaterFall" ADD CONSTRAINT "ShowWidgetWaterFall_waterFallId_fkey" FOREIGN KEY ("waterFallId") REFERENCES "public"."WaterFallChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandlestickChart" ADD CONSTRAINT "CandlestickChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetCandlestick" ADD CONSTRAINT "ShowWidgetCandlestick_candlestickId_fkey" FOREIGN KEY ("candlestickId") REFERENCES "public"."CandlestickChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RadarChart" ADD CONSTRAINT "RadarChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetRadar" ADD CONSTRAINT "ShowWidgetRadar_radarId_fkey" FOREIGN KEY ("radarId") REFERENCES "public"."RadarChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

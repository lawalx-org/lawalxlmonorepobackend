/*
  Warnings:

  - You are about to drop the `ShowWidget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetCandlestick` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetColumn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetDoughnut` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetFunnel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetHeatMap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetHistogram` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetHorizontalBar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetMultiAxis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetParetoChart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetPi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetRadar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetScatter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetSolidGauge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetStackedBarChart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShowWidgetWaterFall` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ShowWidget" DROP CONSTRAINT "ShowWidget_barChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetArea" DROP CONSTRAINT "ShowWidgetArea_areaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetCandlestick" DROP CONSTRAINT "ShowWidgetCandlestick_candlestickId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetColumn" DROP CONSTRAINT "ShowWidgetColumn_columnChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetDoughnut" DROP CONSTRAINT "ShowWidgetDoughnut_DoughnutId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetFunnel" DROP CONSTRAINT "ShowWidgetFunnel_funnelId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetHeatMap" DROP CONSTRAINT "ShowWidgetHeatMap_heatmapId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetHistogram" DROP CONSTRAINT "ShowWidgetHistogram_histogramId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetHorizontalBar" DROP CONSTRAINT "ShowWidgetHorizontalBar_horizontalBarChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetMultiAxis" DROP CONSTRAINT "ShowWidgetMultiAxis_multiAxisId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetParetoChart" DROP CONSTRAINT "ShowWidgetParetoChart_paretoChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetPi" DROP CONSTRAINT "ShowWidgetPi_piChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetRadar" DROP CONSTRAINT "ShowWidgetRadar_radarId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetScatter" DROP CONSTRAINT "ShowWidgetScatter_scatterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetSolidGauge" DROP CONSTRAINT "ShowWidgetSolidGauge_gaugeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetStackedBarChart" DROP CONSTRAINT "ShowWidgetStackedBarChart_stackedBarChartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ShowWidgetWaterFall" DROP CONSTRAINT "ShowWidgetWaterFall_waterFallId_fkey";

-- DropTable
DROP TABLE "public"."ShowWidget";

-- DropTable
DROP TABLE "public"."ShowWidgetArea";

-- DropTable
DROP TABLE "public"."ShowWidgetCandlestick";

-- DropTable
DROP TABLE "public"."ShowWidgetColumn";

-- DropTable
DROP TABLE "public"."ShowWidgetDoughnut";

-- DropTable
DROP TABLE "public"."ShowWidgetFunnel";

-- DropTable
DROP TABLE "public"."ShowWidgetHeatMap";

-- DropTable
DROP TABLE "public"."ShowWidgetHistogram";

-- DropTable
DROP TABLE "public"."ShowWidgetHorizontalBar";

-- DropTable
DROP TABLE "public"."ShowWidgetMultiAxis";

-- DropTable
DROP TABLE "public"."ShowWidgetParetoChart";

-- DropTable
DROP TABLE "public"."ShowWidgetPi";

-- DropTable
DROP TABLE "public"."ShowWidgetRadar";

-- DropTable
DROP TABLE "public"."ShowWidgetScatter";

-- DropTable
DROP TABLE "public"."ShowWidgetSolidGauge";

-- DropTable
DROP TABLE "public"."ShowWidgetStackedBarChart";

-- DropTable
DROP TABLE "public"."ShowWidgetWaterFall";

-- CreateTable
CREATE TABLE "public"."Widget" (
    "id" TEXT NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barChartId" TEXT,
    "horizontalBarChartId" TEXT,
    "piChartId" TEXT,
    "heatMapChartId" TEXT,
    "areaChartId" TEXT,
    "multiAxisChartId" TEXT,
    "columnChartId" TEXT,
    "stackedBarChartId" TEXT,
    "doughnutChartId" TEXT,
    "paretoChartId" TEXT,
    "histogramChartId" TEXT,
    "scatterChartId" TEXT,
    "solidGaugeChartId" TEXT,
    "funnelChartId" TEXT,
    "waterFallChartId" TEXT,
    "candlestickChartId" TEXT,
    "radarChartId" TEXT,

    CONSTRAINT "Widget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_barChartId_fkey" FOREIGN KEY ("barChartId") REFERENCES "public"."barChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_horizontalBarChartId_fkey" FOREIGN KEY ("horizontalBarChartId") REFERENCES "public"."HorizontalBarChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_piChartId_fkey" FOREIGN KEY ("piChartId") REFERENCES "public"."Pi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_heatMapChartId_fkey" FOREIGN KEY ("heatMapChartId") REFERENCES "public"."HeatMapChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_areaChartId_fkey" FOREIGN KEY ("areaChartId") REFERENCES "public"."AreaChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_multiAxisChartId_fkey" FOREIGN KEY ("multiAxisChartId") REFERENCES "public"."MultiAxisChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_columnChartId_fkey" FOREIGN KEY ("columnChartId") REFERENCES "public"."ColumnChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_stackedBarChartId_fkey" FOREIGN KEY ("stackedBarChartId") REFERENCES "public"."StackedBarChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_doughnutChartId_fkey" FOREIGN KEY ("doughnutChartId") REFERENCES "public"."DoughnutChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_paretoChartId_fkey" FOREIGN KEY ("paretoChartId") REFERENCES "public"."ParetoChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_histogramChartId_fkey" FOREIGN KEY ("histogramChartId") REFERENCES "public"."HistogramChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_scatterChartId_fkey" FOREIGN KEY ("scatterChartId") REFERENCES "public"."ScatterChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_solidGaugeChartId_fkey" FOREIGN KEY ("solidGaugeChartId") REFERENCES "public"."SolidGaugeChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_funnelChartId_fkey" FOREIGN KEY ("funnelChartId") REFERENCES "public"."FunnelChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_waterFallChartId_fkey" FOREIGN KEY ("waterFallChartId") REFERENCES "public"."WaterFallChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_candlestickChartId_fkey" FOREIGN KEY ("candlestickChartId") REFERENCES "public"."CandlestickChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Widget" ADD CONSTRAINT "Widget_radarChartId_fkey" FOREIGN KEY ("radarChartId") REFERENCES "public"."RadarChart"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `template_id` on the `programs` table. All the data in the column will be lost.
  - You are about to drop the column `template_id` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `templates` table. All the data in the column will be lost.
  - Added the required column `ownerid` to the `templates` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `templates` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."programs" DROP CONSTRAINT "programs_template_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_template_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."templates" DROP CONSTRAINT "templates_clientId_fkey";

-- AlterTable
ALTER TABLE "public"."programs" DROP COLUMN "template_id";

-- AlterTable
ALTER TABLE "public"."projects" DROP COLUMN "template_id";

-- AlterTable
ALTER TABLE "public"."templates" DROP COLUMN "clientId",
ADD COLUMN     "chartList" TEXT[],
ADD COLUMN     "ownerid" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."programmbuildertemplates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerid" TEXT NOT NULL,
    "charid" TEXT NOT NULL,

    CONSTRAINT "programmbuildertemplates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."barChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "filter_By" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "barChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HorizontalBarChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HorizontalBarChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Piprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER,
    "lastFieldDataset" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "Piprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HeatMapChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HeatMapChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AreaChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "AreaChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MultiAxisChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "MultiAxisChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ColumnChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ColumnChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StackedBarChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFiledDataset" INTEGER NOT NULL,
    "lastFiledDAtaset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ChartTableId" TEXT NOT NULL,

    CONSTRAINT "StackedBarChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoughnutChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "DoughnutChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParetoChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "Left_firstFieldDataset" INTEGER NOT NULL,
    "Left_lastFieldDataset" INTEGER NOT NULL,
    "Right_firstFieldDataset" INTEGER NOT NULL,
    "Right_lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ParetoChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistogramChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HistogramChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScatterChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "ScatterChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolidGaugeChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "startingRange" INTEGER NOT NULL,
    "endRange" INTEGER NOT NULL,
    "gaugeValue" INTEGER NOT NULL,
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

    CONSTRAINT "SolidGaugeChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FunnelChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "FunnelChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WaterFallChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "WaterFallChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CandlestickChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "CandlestickChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RadarChartprogrambuilder" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "RadarChartprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChartTableProgramBuilder" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "public"."ChartStatus" NOT NULL DEFAULT 'INACTIVE',
    "category" "public"."ChartName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "ChartTableProgramBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChartHistoryprogrambuilder" (
    "id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartId" TEXT,

    CONSTRAINT "ChartHistoryprogrambuilder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WidgetProgramBuilder" (
    "id" TEXT NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barChartId" TEXT,
    "horizontalBarChartId" TEXT,
    "pieChartId" TEXT,
    "heatmapChartId" TEXT,
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

    CONSTRAINT "WidgetProgramBuilder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "barChartprogrambuilder_ChartTableId_key" ON "public"."barChartprogrambuilder"("ChartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HorizontalBarChartprogrambuilder_chartTableId_key" ON "public"."HorizontalBarChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "Piprogrambuilder_chartTableId_key" ON "public"."Piprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HeatMapChartprogrambuilder_chartTableId_key" ON "public"."HeatMapChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "AreaChartprogrambuilder_chartTableId_key" ON "public"."AreaChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "MultiAxisChartprogrambuilder_chartTableId_key" ON "public"."MultiAxisChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ColumnChartprogrambuilder_chartTableId_key" ON "public"."ColumnChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "StackedBarChartprogrambuilder_ChartTableId_key" ON "public"."StackedBarChartprogrambuilder"("ChartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "DoughnutChartprogrambuilder_chartTableId_key" ON "public"."DoughnutChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ParetoChartprogrambuilder_chartTableId_key" ON "public"."ParetoChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "HistogramChartprogrambuilder_chartTableId_key" ON "public"."HistogramChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "ScatterChartprogrambuilder_chartTableId_key" ON "public"."ScatterChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "SolidGaugeChartprogrambuilder_chartTableId_key" ON "public"."SolidGaugeChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "FunnelChartprogrambuilder_chartTableId_key" ON "public"."FunnelChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterFallChartprogrambuilder_chartTableId_key" ON "public"."WaterFallChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "CandlestickChartprogrambuilder_chartTableId_key" ON "public"."CandlestickChartprogrambuilder"("chartTableId");

-- CreateIndex
CREATE UNIQUE INDEX "RadarChartprogrambuilder_chartTableId_key" ON "public"."RadarChartprogrambuilder"("chartTableId");

-- AddForeignKey
ALTER TABLE "public"."barChartprogrambuilder" ADD CONSTRAINT "barChartprogrambuilder_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HorizontalBarChartprogrambuilder" ADD CONSTRAINT "HorizontalBarChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Piprogrambuilder" ADD CONSTRAINT "Piprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HeatMapChartprogrambuilder" ADD CONSTRAINT "HeatMapChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AreaChartprogrambuilder" ADD CONSTRAINT "AreaChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MultiAxisChartprogrambuilder" ADD CONSTRAINT "MultiAxisChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ColumnChartprogrambuilder" ADD CONSTRAINT "ColumnChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StackedBarChartprogrambuilder" ADD CONSTRAINT "StackedBarChartprogrambuilder_ChartTableId_fkey" FOREIGN KEY ("ChartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoughnutChartprogrambuilder" ADD CONSTRAINT "DoughnutChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParetoChartprogrambuilder" ADD CONSTRAINT "ParetoChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistogramChartprogrambuilder" ADD CONSTRAINT "HistogramChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScatterChartprogrambuilder" ADD CONSTRAINT "ScatterChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolidGaugeChartprogrambuilder" ADD CONSTRAINT "SolidGaugeChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FunnelChartprogrambuilder" ADD CONSTRAINT "FunnelChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WaterFallChartprogrambuilder" ADD CONSTRAINT "WaterFallChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandlestickChartprogrambuilder" ADD CONSTRAINT "CandlestickChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RadarChartprogrambuilder" ADD CONSTRAINT "RadarChartprogrambuilder_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartTableProgramBuilder" ADD CONSTRAINT "ChartTableProgramBuilder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChartHistoryprogrambuilder" ADD CONSTRAINT "ChartHistoryprogrambuilder_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_barChartId_fkey" FOREIGN KEY ("barChartId") REFERENCES "public"."barChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_horizontalBarChartId_fkey" FOREIGN KEY ("horizontalBarChartId") REFERENCES "public"."HorizontalBarChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_pieChartId_fkey" FOREIGN KEY ("pieChartId") REFERENCES "public"."Piprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_heatmapChartId_fkey" FOREIGN KEY ("heatmapChartId") REFERENCES "public"."HeatMapChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_areaChartId_fkey" FOREIGN KEY ("areaChartId") REFERENCES "public"."AreaChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_multiAxisChartId_fkey" FOREIGN KEY ("multiAxisChartId") REFERENCES "public"."MultiAxisChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_columnChartId_fkey" FOREIGN KEY ("columnChartId") REFERENCES "public"."ColumnChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_stackedBarChartId_fkey" FOREIGN KEY ("stackedBarChartId") REFERENCES "public"."StackedBarChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_doughnutChartId_fkey" FOREIGN KEY ("doughnutChartId") REFERENCES "public"."DoughnutChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_paretoChartId_fkey" FOREIGN KEY ("paretoChartId") REFERENCES "public"."ParetoChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_histogramChartId_fkey" FOREIGN KEY ("histogramChartId") REFERENCES "public"."HistogramChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_scatterChartId_fkey" FOREIGN KEY ("scatterChartId") REFERENCES "public"."ScatterChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_solidGaugeChartId_fkey" FOREIGN KEY ("solidGaugeChartId") REFERENCES "public"."SolidGaugeChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_funnelChartId_fkey" FOREIGN KEY ("funnelChartId") REFERENCES "public"."FunnelChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_waterFallChartId_fkey" FOREIGN KEY ("waterFallChartId") REFERENCES "public"."WaterFallChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_candlestickChartId_fkey" FOREIGN KEY ("candlestickChartId") REFERENCES "public"."CandlestickChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WidgetProgramBuilder" ADD CONSTRAINT "WidgetProgramBuilder_radarChartId_fkey" FOREIGN KEY ("radarChartId") REFERENCES "public"."RadarChartprogrambuilder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

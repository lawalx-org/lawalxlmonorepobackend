-- CreateTable
CREATE TABLE "public"."HeatMapChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset_X" INTEGER NOT NULL,
    "numberOfDataset_Y" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HeatMapChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetHeatMap" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "heatmapId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetHeatMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeatMapChart_chartTableId_key" ON "public"."HeatMapChart"("chartTableId");

-- AddForeignKey
ALTER TABLE "public"."HeatMapChart" ADD CONSTRAINT "HeatMapChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetHeatMap" ADD CONSTRAINT "ShowWidgetHeatMap_heatmapId_fkey" FOREIGN KEY ("heatmapId") REFERENCES "public"."HeatMapChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

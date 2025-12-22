-- CreateTable
CREATE TABLE "public"."HorizontalBarChart" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "firstFieldDataset" INTEGER NOT NULL,
    "lastFieldDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartTableId" TEXT NOT NULL,

    CONSTRAINT "HorizontalBarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetHorizontalBar" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "horizontalBarChartId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetHorizontalBar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HorizontalBarChart_chartTableId_key" ON "public"."HorizontalBarChart"("chartTableId");

-- AddForeignKey
ALTER TABLE "public"."HorizontalBarChart" ADD CONSTRAINT "HorizontalBarChart_chartTableId_fkey" FOREIGN KEY ("chartTableId") REFERENCES "public"."ChartTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetHorizontalBar" ADD CONSTRAINT "ShowWidgetHorizontalBar_horizontalBarChartId_fkey" FOREIGN KEY ("horizontalBarChartId") REFERENCES "public"."HorizontalBarChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."ChartTable" ADD COLUMN     "piId" TEXT;

-- CreateTable
CREATE TABLE "public"."Pi" (
    "id" TEXT NOT NULL,
    "numberOfDataset" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidgetPi" (
    "id" SERIAL NOT NULL,
    "legendName" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "piChartId" TEXT NOT NULL,

    CONSTRAINT "ShowWidgetPi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_piId_fkey" FOREIGN KEY ("piId") REFERENCES "public"."Pi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShowWidgetPi" ADD CONSTRAINT "ShowWidgetPi_piChartId_fkey" FOREIGN KEY ("piChartId") REFERENCES "public"."Pi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

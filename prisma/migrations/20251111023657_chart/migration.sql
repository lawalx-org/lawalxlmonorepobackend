-- CreateEnum
CREATE TYPE "ChartStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "ChartName" AS ENUM ('BAR', 'LINE', 'PIE', 'DOUGHNUT', 'RADAR', 'POLAR_AREA', 'BUBBLE', 'SCATTER', 'AREA', 'MIXED', 'GAUGE', 'FUNNEL', 'TREEMAP', 'SUNBURST', 'SANKEY', 'TABLE');

-- CreateTable
CREATE TABLE "ChartTable" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ChartStatus" NOT NULL,
    "category" "ChartName" NOT NULL,
    "xAxis" JSONB NOT NULL,
    "yAxis" JSONB NOT NULL,
    "zAxis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartTable_pkey" PRIMARY KEY ("id")
);

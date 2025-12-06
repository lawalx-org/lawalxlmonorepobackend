-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ChartName" ADD VALUE 'HEATMAP';
ALTER TYPE "public"."ChartName" ADD VALUE 'HORIZONTAL_BAR';
ALTER TYPE "public"."ChartName" ADD VALUE 'STACK_BAR_HORIZONTAL';
ALTER TYPE "public"."ChartName" ADD VALUE 'COLUMN';
ALTER TYPE "public"."ChartName" ADD VALUE 'PARETO';
ALTER TYPE "public"."ChartName" ADD VALUE 'HISTOGRAM';
ALTER TYPE "public"."ChartName" ADD VALUE 'WATERFALL';
ALTER TYPE "public"."ChartName" ADD VALUE 'CANDLESTICK';
ALTER TYPE "public"."ChartName" ADD VALUE 'GEOGRAPHY_GRAPH';
ALTER TYPE "public"."ChartName" ADD VALUE 'SPLINE';

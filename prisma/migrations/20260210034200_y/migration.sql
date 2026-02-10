-- CreateEnum
CREATE TYPE "public"."NodeType" AS ENUM ('PARENT', 'LEAF');

-- AlterTable
ALTER TABLE "public"."ChartTable" ADD COLUMN     "aggregatedData" JSONB,
ADD COLUMN     "nodeType" "public"."NodeType" NOT NULL DEFAULT 'LEAF';

-- AlterTable
ALTER TABLE "public"."Widget" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL DEFAULT 0;

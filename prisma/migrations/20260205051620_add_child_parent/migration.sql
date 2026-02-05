-- AlterTable
ALTER TABLE "public"."ChartTable" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."ChartTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

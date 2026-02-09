-- CreateTable
CREATE TABLE "public"."Valuediteact" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "rowname" TEXT NOT NULL,

    CONSTRAINT "Valuediteact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Valuediteact" ADD CONSTRAINT "Valuediteact_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."ChartTableProgramBuilder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

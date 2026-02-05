-- CreateTable
CREATE TABLE "public"."ChartHistory" (
    "id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chartId" TEXT,

    CONSTRAINT "ChartHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChartHistory_chartId_key" ON "public"."ChartHistory"("chartId");

-- AddForeignKey
ALTER TABLE "public"."ChartHistory" ADD CONSTRAINT "ChartHistory_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "public"."ChartTable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."ChartTable" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "public"."ChartStatus" NOT NULL,
    "category" "public"."ChartName" NOT NULL,
    "xAxis" JSONB NOT NULL,
    "yAxis" JSONB NOT NULL,
    "zAxis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sheetId" TEXT,

    CONSTRAINT "ChartTable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChartTable_sheetId_key" ON "public"."ChartTable"("sheetId");

-- AddForeignKey
ALTER TABLE "public"."ChartTable" ADD CONSTRAINT "ChartTable_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "public"."Sheet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

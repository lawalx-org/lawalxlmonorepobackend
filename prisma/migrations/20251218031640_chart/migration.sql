-- CreateTable
CREATE TABLE "public"."StackBarChart" (
    "id" SERIAL NOT NULL,
    "widget_name" TEXT NOT NULL,
    "number_of_labels" INTEGER NOT NULL,
    "xAxisLabels" JSONB NOT NULL,
    "first_fields" INTEGER NOT NULL,
    "last_field_data" INTEGER NOT NULL,
    "chart_name" "public"."ChartName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StackBarChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShowWidget" (
    "id" SERIAL NOT NULL,
    "legend_name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "values" JSONB NOT NULL,
    "stackBarChartId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowWidget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ShowWidget" ADD CONSTRAINT "ShowWidget_stackBarChartId_fkey" FOREIGN KEY ("stackBarChartId") REFERENCES "public"."StackBarChart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

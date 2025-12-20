/*
  Warnings:

  - You are about to drop the `ShowWidget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StackBarChart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ShowWidget" DROP CONSTRAINT "ShowWidget_stackBarChartId_fkey";

-- DropTable
DROP TABLE "public"."ShowWidget";

-- DropTable
DROP TABLE "public"."StackBarChart";

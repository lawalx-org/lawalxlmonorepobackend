/*
  Warnings:

  - Added the required column `projectnumber` to the `ChartTableProgramBuilder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChartTableProgramBuilder" ADD COLUMN     "projectnumber" INTEGER NOT NULL;

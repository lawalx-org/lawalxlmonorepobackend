/*
  Warnings:

  - The `progress` column on the `InfrastructureNode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `computedProgress` column on the `InfrastructureNode` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."InfrastructureNode" ADD COLUMN     "numericProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "progress",
ADD COLUMN     "progress" JSONB,
DROP COLUMN "computedProgress",
ADD COLUMN     "computedProgress" JSONB NOT NULL DEFAULT '[]';

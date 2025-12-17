/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `InfrastructureProject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `InfrastructureProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."InfrastructureProject" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InfrastructureProject_slug_key" ON "public"."InfrastructureProject"("slug");

-- CreateIndex
CREATE INDEX "InfrastructureProject_slug_id_idx" ON "public"."InfrastructureProject"("slug", "id");

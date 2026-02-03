/*
  Warnings:

  - You are about to drop the column `status` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `managers` table. All the data in the column will be lost.
  - The `lastActive` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `status` on the `viewers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."employees" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."managers" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "lastActive",
ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."viewers" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."Level";

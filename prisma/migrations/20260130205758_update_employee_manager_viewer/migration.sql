/*
  Warnings:

  - You are about to drop the column `projectId` on the `viewers` table. All the data in the column will be lost.
  - Added the required column `joinedDate` to the `viewers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Level" AS ENUM ('Active', 'InActive');

-- AlterTable
ALTER TABLE "public"."employees" ADD COLUMN     "status" "public"."Level" NOT NULL DEFAULT 'InActive',
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."managers" ADD COLUMN     "status" "public"."Level" NOT NULL DEFAULT 'InActive',
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."viewers" DROP COLUMN "projectId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "joinedDate" TEXT NOT NULL,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "status" "public"."Level" NOT NULL DEFAULT 'InActive';

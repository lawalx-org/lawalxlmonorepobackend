-- DropForeignKey
ALTER TABLE "public"."employees" DROP CONSTRAINT "employees_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."managers" DROP CONSTRAINT "managers_clientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."viewers" DROP CONSTRAINT "viewers_clientId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "verification2FA" SET DEFAULT false;

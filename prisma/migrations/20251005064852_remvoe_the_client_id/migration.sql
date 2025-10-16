/*
  Warnings:

  - You are about to drop the column `clientId` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `managers` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `viewers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "managers" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "viewers" DROP COLUMN "clientId";

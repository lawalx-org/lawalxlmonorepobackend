/*
  Warnings:

  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED', 'DELETED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive",
DROP COLUMN "isDeleted",
ADD COLUMN     "userStatus" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

/*
  Warnings:

  - You are about to drop the column `senderIds` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "senderIds",
ADD COLUMN     "senderId" TEXT NOT NULL;

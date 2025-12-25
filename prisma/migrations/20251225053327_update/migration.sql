/*
  Warnings:

  - Added the required column `viewerId` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "viewerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."viewers" ADD COLUMN     "projectId" TEXT[];

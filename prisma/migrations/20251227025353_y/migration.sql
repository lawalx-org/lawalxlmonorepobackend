-- DropForeignKey
ALTER TABLE "public"."projects" DROP CONSTRAINT "projects_viewerId_fkey";

-- CreateTable
CREATE TABLE "public"."project_viewers" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,

    CONSTRAINT "project_viewers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_viewers_projectId_viewerId_key" ON "public"."project_viewers"("projectId", "viewerId");

-- AddForeignKey
ALTER TABLE "public"."project_viewers" ADD CONSTRAINT "project_viewers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_viewers" ADD CONSTRAINT "project_viewers_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "public"."viewers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

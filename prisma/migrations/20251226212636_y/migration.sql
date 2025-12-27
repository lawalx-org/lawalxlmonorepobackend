-- CreateTable
CREATE TABLE "public"."favourite_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favourite_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favourite_projects_userId_idx" ON "public"."favourite_projects"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favourite_projects_userId_projectId_key" ON "public"."favourite_projects"("userId", "projectId");

-- AddForeignKey
ALTER TABLE "public"."favourite_projects" ADD CONSTRAINT "favourite_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

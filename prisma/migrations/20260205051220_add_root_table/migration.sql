-- CreateTable
CREATE TABLE "public"."RootChart" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "RootChart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RootChart" ADD CONSTRAINT "RootChart_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

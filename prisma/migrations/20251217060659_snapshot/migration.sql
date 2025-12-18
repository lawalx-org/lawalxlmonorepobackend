-- CreateTable
CREATE TABLE "public"."InfrastructureProjectSnapshot" (
    "id" TEXT NOT NULL,
    "infrastructureProjectId" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "InfrastructureProjectSnapshot_pkey" PRIMARY KEY ("id")
);

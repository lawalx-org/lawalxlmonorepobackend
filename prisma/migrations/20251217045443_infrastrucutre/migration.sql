-- CreateTable
CREATE TABLE "public"."InfrastructureNode" (
    "id" TEXT NOT NULL,
    "infrastructureProjectId" TEXT NOT NULL,
    "parentId" TEXT,
    "name" TEXT NOT NULL,
    "progress" DOUBLE PRECISION,
    "computedProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "isLeaf" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfrastructureNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InfrastructureProject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "computedProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InfrastructureProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InfrastructureNode_infrastructureProjectId_idx" ON "public"."InfrastructureNode"("infrastructureProjectId");

-- CreateIndex
CREATE INDEX "InfrastructureNode_parentId_idx" ON "public"."InfrastructureNode"("parentId");

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_infrastructureProjectId_fkey" FOREIGN KEY ("infrastructureProjectId") REFERENCES "public"."InfrastructureProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InfrastructureNode" ADD CONSTRAINT "InfrastructureNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."InfrastructureNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

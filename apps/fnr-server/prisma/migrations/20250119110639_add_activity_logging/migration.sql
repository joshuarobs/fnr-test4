-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CLAIM_CREATED', 'CLAIM_UPDATED', 'CLAIM_DELETED', 'CLAIM_STATUS_CHANGED', 'CLAIM_HANDLER_ASSIGNED', 'ITEM_CREATED', 'ITEM_UPDATED', 'ITEM_DELETED', 'ITEM_STATUS_CHANGED', 'ITEM_EVIDENCE_ADDED', 'ITEM_EVIDENCE_REMOVED', 'ITEMS_BULK_CREATED', 'ITEMS_BULK_UPDATED', 'ITEMS_BULK_DELETED', 'EVIDENCE_BULK_ADDED', 'EVIDENCE_BULK_REMOVED');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "claimId" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLogItem" (
    "id" SERIAL NOT NULL,
    "activityLogId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "ActivityLogItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLogEvidence" (
    "id" SERIAL NOT NULL,
    "activityLogId" INTEGER NOT NULL,
    "evidenceId" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "ActivityLogEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_claimId_idx" ON "ActivityLog"("claimId");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_activityType_idx" ON "ActivityLog"("activityType");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ActivityLog_claimId_activityType_idx" ON "ActivityLog"("claimId", "activityType");

-- CreateIndex
CREATE INDEX "ActivityLog_claimId_createdAt_idx" ON "ActivityLog"("claimId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLogItem_activityLogId_idx" ON "ActivityLogItem"("activityLogId");

-- CreateIndex
CREATE INDEX "ActivityLogItem_itemId_idx" ON "ActivityLogItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityLogItem_activityLogId_itemId_key" ON "ActivityLogItem"("activityLogId", "itemId");

-- CreateIndex
CREATE INDEX "ActivityLogEvidence_activityLogId_idx" ON "ActivityLogEvidence"("activityLogId");

-- CreateIndex
CREATE INDEX "ActivityLogEvidence_evidenceId_idx" ON "ActivityLogEvidence"("evidenceId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityLogEvidence_activityLogId_evidenceId_key" ON "ActivityLogEvidence"("activityLogId", "evidenceId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "BaseUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLogItem" ADD CONSTRAINT "ActivityLogItem_activityLogId_fkey" FOREIGN KEY ("activityLogId") REFERENCES "ActivityLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLogItem" ADD CONSTRAINT "ActivityLogItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLogEvidence" ADD CONSTRAINT "ActivityLogEvidence_activityLogId_fkey" FOREIGN KEY ("activityLogId") REFERENCES "ActivityLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLogEvidence" ADD CONSTRAINT "ActivityLogEvidence_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

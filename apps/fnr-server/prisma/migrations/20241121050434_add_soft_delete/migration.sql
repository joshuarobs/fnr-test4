-- AlterTable
ALTER TABLE "BaseUser" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Insured" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "RecentlyViewedClaim" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "BaseUser_is_deleted_idx" ON "BaseUser"("is_deleted");

-- CreateIndex
CREATE INDEX "Claim_is_deleted_idx" ON "Claim"("is_deleted");

-- CreateIndex
CREATE INDEX "Comment_is_deleted_idx" ON "Comment"("is_deleted");

-- CreateIndex
CREATE INDEX "Evidence_is_deleted_idx" ON "Evidence"("is_deleted");

-- CreateIndex
CREATE INDEX "Insured_is_deleted_idx" ON "Insured"("is_deleted");

-- CreateIndex
CREATE INDEX "Item_is_deleted_idx" ON "Item"("is_deleted");

-- CreateIndex
CREATE INDEX "RecentlyViewedClaim_is_deleted_idx" ON "RecentlyViewedClaim"("is_deleted");

-- CreateIndex
CREATE INDEX "Staff_is_deleted_idx" ON "Staff"("is_deleted");

-- CreateIndex
CREATE INDEX "Supplier_is_deleted_idx" ON "Supplier"("is_deleted");

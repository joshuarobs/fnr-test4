-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "delete_reason" TEXT,
ADD COLUMN     "deleted_by" INTEGER;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "BaseUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

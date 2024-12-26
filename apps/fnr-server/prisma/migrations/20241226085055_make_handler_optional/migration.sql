-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_handlerId_fkey";

-- AlterTable
ALTER TABLE "Claim" ALTER COLUMN "handlerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_handlerId_fkey" FOREIGN KEY ("handlerId") REFERENCES "BaseUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

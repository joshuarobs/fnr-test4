/*
  Warnings:

  - You are about to drop the column `ROOMCATEGORY` on the `Item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Item_ROOMCATEGORY_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "ROOMCATEGORY",
ADD COLUMN     "roomCategory" "RoomCategory";

-- CreateIndex
CREATE INDEX "Item_roomCategory_idx" ON "Item"("roomCategory");

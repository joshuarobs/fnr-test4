/*
  Warnings:

  - You are about to drop the column `roomcategory` on the `Item` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Item_roomcategory_idx";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "roomcategory",
ADD COLUMN     "ROOMCATEGORY" "RoomCategory";

-- CreateIndex
CREATE INDEX "Item_ROOMCATEGORY_idx" ON "Item"("ROOMCATEGORY");

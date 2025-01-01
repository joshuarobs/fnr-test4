-- CreateTable
CREATE TABLE "_BaseUserToClaim" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BaseUserToClaim_AB_unique" ON "_BaseUserToClaim"("A", "B");

-- CreateIndex
CREATE INDEX "_BaseUserToClaim_B_index" ON "_BaseUserToClaim"("B");

-- AddForeignKey
ALTER TABLE "_BaseUserToClaim" ADD CONSTRAINT "_BaseUserToClaim_A_fkey" FOREIGN KEY ("A") REFERENCES "BaseUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BaseUserToClaim" ADD CONSTRAINT "_BaseUserToClaim_B_fkey" FOREIGN KEY ("B") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

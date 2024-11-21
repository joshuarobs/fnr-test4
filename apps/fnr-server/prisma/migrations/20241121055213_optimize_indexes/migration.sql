-- CreateIndex
CREATE INDEX "BaseUser_email_idx" ON "BaseUser"("email");

-- CreateIndex
CREATE INDEX "BaseUser_role_isActive_idx" ON "BaseUser"("role", "isActive");

-- CreateIndex
CREATE INDEX "BaseUser_lastName_firstName_idx" ON "BaseUser"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Claim_claimNumber_idx" ON "Claim"("claimNumber");

-- CreateIndex
CREATE INDEX "Claim_policyNumber_idx" ON "Claim"("policyNumber");

-- CreateIndex
CREATE INDEX "Claim_status_idx" ON "Claim"("status");

-- CreateIndex
CREATE INDEX "Claim_insuredId_idx" ON "Claim"("insuredId");

-- CreateIndex
CREATE INDEX "Claim_handlerId_idx" ON "Claim"("handlerId");

-- CreateIndex
CREATE INDEX "Claim_createdAt_idx" ON "Claim"("createdAt");

-- CreateIndex
CREATE INDEX "Claim_status_is_deleted_idx" ON "Claim"("status", "is_deleted");

-- CreateIndex
CREATE INDEX "Claim_insuredId_status_idx" ON "Claim"("insuredId", "status");

-- CreateIndex
CREATE INDEX "Comment_claimId_idx" ON "Comment"("claimId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_claimId_isInternal_idx" ON "Comment"("claimId", "isInternal");

-- CreateIndex
CREATE INDEX "Comment_createdAt_idx" ON "Comment"("createdAt");

-- CreateIndex
CREATE INDEX "Evidence_itemId_idx" ON "Evidence"("itemId");

-- CreateIndex
CREATE INDEX "Evidence_type_idx" ON "Evidence"("type");

-- CreateIndex
CREATE INDEX "Evidence_itemId_type_idx" ON "Evidence"("itemId", "type");

-- CreateIndex
CREATE INDEX "Item_claimId_idx" ON "Item"("claimId");

-- CreateIndex
CREATE INDEX "Item_category_idx" ON "Item"("category");

-- CreateIndex
CREATE INDEX "Item_itemStatus_idx" ON "Item"("itemStatus");

-- CreateIndex
CREATE INDEX "Item_claimId_itemStatus_idx" ON "Item"("claimId", "itemStatus");

-- CreateIndex
CREATE INDEX "Staff_department_idx" ON "Staff"("department");

-- CreateIndex
CREATE INDEX "Staff_employeeId_idx" ON "Staff"("employeeId");

-- CreateIndex
CREATE INDEX "Supplier_company_idx" ON "Supplier"("company");

-- CreateIndex
CREATE INDEX "Supplier_ratings_idx" ON "Supplier"("ratings");

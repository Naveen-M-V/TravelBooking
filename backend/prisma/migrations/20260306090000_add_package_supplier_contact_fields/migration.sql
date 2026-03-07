-- AlterTable
ALTER TABLE "packages"
ADD COLUMN "supplierName" TEXT,
ADD COLUMN "supplierEmail" TEXT;

-- CreateIndex
CREATE INDEX "packages_supplierEmail_idx" ON "packages"("supplierEmail");

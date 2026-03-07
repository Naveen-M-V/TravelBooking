-- AlterTable
ALTER TABLE "packages" ADD COLUMN     "supplierId" TEXT;

-- CreateIndex
CREATE INDEX "packages_supplierId_idx" ON "packages"("supplierId");

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

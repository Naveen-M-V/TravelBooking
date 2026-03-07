-- CreateTable
CREATE TABLE "wishlist_items" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wishlist_items_userId_idx" ON "wishlist_items"("userId");

-- CreateIndex
CREATE INDEX "wishlist_items_packageId_idx" ON "wishlist_items"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "wishlist_items_userId_packageId_key" ON "wishlist_items"("userId", "packageId");

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

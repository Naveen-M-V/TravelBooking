-- CreateTable
CREATE TABLE "flight_markups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default Markup',
    "markupType" TEXT NOT NULL DEFAULT 'PERCENT',
    "markupValue" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'SAR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_markups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flight_markups_isActive_idx" ON "flight_markups"("isActive");

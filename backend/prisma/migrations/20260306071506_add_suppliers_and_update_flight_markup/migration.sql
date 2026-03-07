/*
  Warnings:

  - You are about to drop the column `currency` on the `flight_markups` table. All the data in the column will be lost.
  - You are about to drop the column `markupType` on the `flight_markups` table. All the data in the column will be lost.
  - You are about to drop the column `markupValue` on the `flight_markups` table. All the data in the column will be lost.
  - Added the required column `percentageValue` to the `flight_markups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flight_markups" DROP COLUMN "currency",
DROP COLUMN "markupType",
DROP COLUMN "markupValue",
ADD COLUMN     "percentageValue" DECIMAL(5,2) NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Flight Markup';

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "contactPerson" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");

-- CreateIndex
CREATE INDEX "suppliers_isActive_idx" ON "suppliers"("isActive");

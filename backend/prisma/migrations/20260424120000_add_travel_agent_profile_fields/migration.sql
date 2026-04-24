-- AlterTable
ALTER TABLE "users" ADD COLUMN "isTravelAgent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "companyName" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "website" TEXT;

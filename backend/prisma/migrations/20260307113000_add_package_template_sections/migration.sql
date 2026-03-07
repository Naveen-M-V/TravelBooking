-- Add package content sections for P1 template
ALTER TABLE "packages"
  ADD COLUMN "excluded" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "bookingConditions" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "halalFacilities" JSONB NOT NULL DEFAULT '[]';

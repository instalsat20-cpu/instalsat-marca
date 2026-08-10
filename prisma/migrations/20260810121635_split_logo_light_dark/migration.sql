-- AlterTable: split single logoUrl into dark/light background variants
ALTER TABLE "Settings" ADD COLUMN "logoUrlDark" TEXT;
ALTER TABLE "Settings" ADD COLUMN "logoUrlLight" TEXT;

-- Preserve existing value: current logo was used on the (dark) sidebar background
UPDATE "Settings" SET "logoUrlDark" = "logoUrl" WHERE "logoUrl" IS NOT NULL;

ALTER TABLE "Settings" DROP COLUMN "logoUrl";

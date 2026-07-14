/*
  Warnings:

  - Added the required column `maintenanceFeeCents` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "maintenanceFeeCents" INTEGER;

-- Backfill existing rows with the fee constant in effect at migration time (lib/pricing.ts).
UPDATE "Appointment" SET "maintenanceFeeCents" = 200 WHERE "maintenanceFeeCents" IS NULL;

ALTER TABLE "Appointment" ALTER COLUMN "maintenanceFeeCents" SET NOT NULL;

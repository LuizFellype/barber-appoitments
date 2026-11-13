-- CreateTable
CREATE TABLE "Barber" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Barber_pkey" PRIMARY KEY ("id")
);

-- AlterTable: add barberId nullable first, backfill, then tighten to NOT NULL.
ALTER TABLE "Slot" ADD COLUMN "barberId" TEXT;

-- Backfill: existing slots (created before barbers existed) get a default barber.
INSERT INTO "Barber" ("id", "name", "active", "createdAt")
VALUES ('default-barber', 'Barbeiro', true, CURRENT_TIMESTAMP);

UPDATE "Slot" SET "barberId" = 'default-barber' WHERE "barberId" IS NULL;

ALTER TABLE "Slot" ALTER COLUMN "barberId" SET NOT NULL;

-- DropIndex
DROP INDEX "Slot_date_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "Slot_date_time_barberId_key" ON "Slot"("date", "time", "barberId");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Barber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

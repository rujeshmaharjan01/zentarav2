-- AlterTable
ALTER TABLE "Booking" ADD COLUMN "name" TEXT,
ADD COLUMN "email" TEXT,
ADD COLUMN "phone" TEXT,
ADD COLUMN "specialRequests" TEXT;

-- CreateIndex
CREATE INDEX "Booking_packageId_travelDate_idx" ON "Booking"("packageId", "travelDate");

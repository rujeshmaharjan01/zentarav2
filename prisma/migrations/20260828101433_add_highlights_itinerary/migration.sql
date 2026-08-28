-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "highlights" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "itinerary" JSONB NOT NULL DEFAULT '[]';

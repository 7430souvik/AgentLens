-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "errorStack" TEXT,
ADD COLUMN     "inputTokens" INTEGER,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "outputTokens" INTEGER,
ADD COLUMN     "spanId" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "traceId" TEXT;

-- CreateIndex
CREATE INDEX "Event_traceId_idx" ON "Event"("traceId");

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

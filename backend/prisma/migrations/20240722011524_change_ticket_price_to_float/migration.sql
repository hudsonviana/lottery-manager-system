/*
  Warnings:

  - You are about to alter the column `ticketPrice` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "ticketPrice" SET DATA TYPE DOUBLE PRECISION;

/*
  Warnings:

  - The values [MEGASENA] on the enum `Lottery` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Lottery_new" AS ENUM ('MEGA_SENA', 'QUINA', 'LOTOFACIL', 'TIMEMANIA', 'LOTOMANIA');
ALTER TABLE "Draw" ALTER COLUMN "lotteryType" DROP DEFAULT;
ALTER TABLE "Draw" ALTER COLUMN "lotteryType" TYPE "Lottery_new" USING ("lotteryType"::text::"Lottery_new");
ALTER TYPE "Lottery" RENAME TO "Lottery_old";
ALTER TYPE "Lottery_new" RENAME TO "Lottery";
DROP TYPE "Lottery_old";
ALTER TABLE "Draw" ALTER COLUMN "lotteryType" SET DEFAULT 'MEGA_SENA';
COMMIT;

-- AlterTable
ALTER TABLE "Draw" ALTER COLUMN "lotteryType" SET DEFAULT 'MEGA_SENA';

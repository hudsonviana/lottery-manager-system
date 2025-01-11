/*
  Warnings:

  - You are about to alter the column `name` on the `Group` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(30)`.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "theme" TEXT DEFAULT 'gray',
ALTER COLUMN "name" SET DATA TYPE VARCHAR(30);

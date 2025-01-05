-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_drawId_fkey";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

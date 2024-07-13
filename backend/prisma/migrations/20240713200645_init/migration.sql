-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Lottery" AS ENUM ('MEGASENA', 'QUINA', 'LOTOFACIL', 'TIMEMANIA', 'LOTOMANIA');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WON_SIX_NUM', 'WON_FIVE_NUM', 'WON_FOUR_NUM', 'LOST', 'PENDING');

-- CreateEnum
CREATE TYPE "DrawStatus" AS ENUM ('DRAWN', 'PENDING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "gameNumbers" JSONB NOT NULL,
    "ticketPrice" DECIMAL(10,2),
    "result" "GameResult" NOT NULL DEFAULT 'PENDING',
    "playerId" TEXT NOT NULL,
    "drawId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Draw" (
    "id" TEXT NOT NULL,
    "lotteryType" "Lottery" NOT NULL DEFAULT 'MEGASENA',
    "contestNumber" INTEGER NOT NULL,
    "drawDate" TIMESTAMP(3) NOT NULL,
    "status" "DrawStatus" NOT NULL DEFAULT 'PENDING',
    "drawnNumbers" JSONB DEFAULT '[]',
    "prize" JSONB DEFAULT '[]',
    "accumulated" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_key" ON "User"("firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "Draw_contestNumber_key" ON "Draw"("contestNumber");

-- CreateIndex
CREATE INDEX "Draw_contestNumber_idx" ON "Draw"("contestNumber");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_drawId_fkey" FOREIGN KEY ("drawId") REFERENCES "Draw"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

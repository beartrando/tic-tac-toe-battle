/*
  Warnings:

  - You are about to delete the column `players` on the `Battle` table. All the data in the column will be lost.
  - You are about to delete the column `winner` on the `Battle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "players",
DROP
COLUMN "winner",
ADD COLUMN     "playerIds" TEXT[],
ADD COLUMN     "winnerId" TEXT;

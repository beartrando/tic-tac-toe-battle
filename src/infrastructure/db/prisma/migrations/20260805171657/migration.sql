/*
  Warnings:

  - You are about to drop the column `cells` on the `Battle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Battle" DROP COLUMN "cells",
ADD COLUMN     "board" "BattleCellValue"[];

/*
  Warnings:

  - The values [Active] on the enum `BattleStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BattleStatus_new" AS ENUM ('Created', 'Ready', 'Started', 'Finished', 'Cancelled');
ALTER TABLE "Battle" ALTER COLUMN "status" TYPE "BattleStatus_new" USING ("status"::text::"BattleStatus_new");
ALTER TYPE "BattleStatus" RENAME TO "BattleStatus_old";
ALTER TYPE "BattleStatus_new" RENAME TO "BattleStatus";
DROP TYPE "public"."BattleStatus_old";
COMMIT;

/*
  Warnings:

  - Added the required column `type` to the `stack` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."stack_plugins_stackId_pluginId_position_key";

-- AlterTable
ALTER TABLE "public"."plugin" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."stack" ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

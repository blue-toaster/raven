/*
  Warnings:

  - You are about to drop the column `modlog` on the `guild_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guild_settings" DROP COLUMN "modlog",
ADD COLUMN     "mod_log_channel_id" TEXT,
ADD COLUMN     "mod_log_url" TEXT;

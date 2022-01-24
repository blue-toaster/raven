-- CreateTable
CREATE TABLE "guild_settings" (
    "guild_id" TEXT NOT NULL,
    "prefix" TEXT,

    CONSTRAINT "guild_settings_pkey" PRIMARY KEY ("guild_id")
);

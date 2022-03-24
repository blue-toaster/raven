import type { Prisma } from '@prisma/client'
import { container } from '@sapphire/pieces'
import type { Snowflake } from 'discord-api-types'

export async function readSettings(guildId: Snowflake) {
  return await container.prisma.guildSettings.findUnique({
    where: {
      guildId
    }
  })
}

export async function writeSettings(guildId: Snowflake, data: unknown) {
  return await container.prisma.guildSettings.upsert({
    where: {
      guildId
    },
    create: {
      guildId,
    },
    update: data as Prisma.GuildSettingsCreateInput
  })
}

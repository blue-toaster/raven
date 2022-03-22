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

export async function createSettings(guildId: Snowflake) {
  return await container.prisma.guildSettings.create({
    data: {
      guildId
    }
  })
}

export async function writeSettings(guildId: Snowflake, data: Prisma.GuildSettingsUpdateInput) {
  return await container.prisma.guildSettings.update({
    where: {
      guildId
    },
    data
  })
}

import Client from '#lib/Client'
import { envParseString } from '#lib/env'
import { LogLevel } from '@sapphire/framework'

const client = new Client({
  defaultPrefix: envParseString('PREFIX'),
  caseInsensitivePrefixes: true,
  caseInsensitiveCommands: true,
  intents: ['GUILDS', 'GUILD_MESSAGES'],
  logger: {
    level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug
  },
  hmr: {
    enabled: process.env.NODE_ENV === 'development'
  },
  shards: 'auto'
})

void client.start()

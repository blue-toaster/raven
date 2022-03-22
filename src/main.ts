import Client from '#lib/Client'
import { envParseString } from '#lib/env'
import { LogLevel } from '@sapphire/framework'
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis'

const client = new Client({
  defaultPrefix: envParseString('PREFIX'),
  caseInsensitivePrefixes: true,
  caseInsensitiveCommands: true,
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'],
  logger: {
    level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug
  },
  hmr: {
    enabled: process.env.NODE_ENV === 'development'
  },
  shards: 'auto',
  tasks: {
    strategy: new ScheduledTaskRedisStrategy({
      bull: {
        redis: {
          port: 6379,
          host: 'redis',
          password: 'redis',
          db: 2
        }
      }
    })
  },
})

void client.start()

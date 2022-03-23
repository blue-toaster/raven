import { envParseInteger, envParseString } from '#lib/env'
import Client from '#lib/Raven'
import '#lib/setup'
import { LogLevel } from '@sapphire/framework'
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis'

const client = new Client({
  defaultPrefix: envParseString('PREFIX'),
  caseInsensitivePrefixes: true,
  caseInsensitiveCommands: true,
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_BANS', 'DIRECT_MESSAGES'],
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
          port: envParseInteger('REDIS_PORT'),
          host: envParseString('REDIS_HOST'),
          password: envParseString('REDIS_PASSWD'),
          db: envParseInteger('REDIS_DB')
        }
      }
    })
  },
})

const main = async () => {
  try {
    client.logger.info('Starting Raven...')
    await client.login()
    client.logger.info('Logged in!')
  } catch (error) {
    client.logger.fatal(error)
    client.destroy()
    process.exit(1)
  }
}

void main()

import { minutes, readSettings } from '#util'
import { PrismaClient } from '@prisma/client'
import { container, LogLevel, SapphireClient } from '@sapphire/framework'
import { ScheduledTaskRedisStrategy } from '@sapphire/plugin-scheduled-tasks/register-redis'
import { ClientOptions, Message, Options } from 'discord.js'
import { envParseBoolean, envParseInteger, envParseString } from './env'
import AnalyticData from './structures/AnalyticData'

export default class Client extends SapphireClient {
  public prisma!: PrismaClient
  constructor() {
    super(parseConfig())

    container.analytics = envParseBoolean('INFLUX_ENABLED') ? new AnalyticData() : null
  }

  public async start(): Promise<this> {
    await this._init()
    await super.login()

    return this
  }

  public stop(): void {
    this.logger.warn('Received exit signal. Terminating in 5 seconds...')
    this.destroy()
    setTimeout(() => {
      void this.prisma.$disconnect()
      this.logger.warn('Terminating...')
      process.exit(0)
    }, 5000)
  }

  private async _init(): Promise<void> {
    const prisma = new PrismaClient({
      errorFormat: 'pretty',
      log: [
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
        { emit: 'event', level: 'query' },
      ]
    })

    this.prisma = prisma
    container.prisma = prisma

    await prisma.$connect()

    process.once('SIGINT', () => this.stop())
    process.once('SIGTERM', () => this.stop())
  }

  public fetchPrefix = async (message: Message): Promise<string> => {
    const guild = await readSettings(message.guild!.id)

    return guild?.prefix ?? envParseString('PREFIX')
  }
}

function parseConfig(): ClientOptions {
  return {
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS'],
    logger: {
      level: process.env.NODE_ENV === 'production' ? LogLevel.Info : LogLevel.Debug
    },
    hmr: {
      enabled: process.env.NODE_ENV === 'development'
    },
    sweepers: {
      ...Options.defaultSweeperSettings,
      messages: {
        interval: minutes(5),
        lifetime: minutes(15)
      } 
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
  }
}

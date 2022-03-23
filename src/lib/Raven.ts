import { PrismaClient } from '@prisma/client'
import { container, SapphireClient } from '@sapphire/framework'
import type { ClientOptions, Message } from 'discord.js'
import { envParseBoolean, envParseString } from './env'
import './setup'
import AnalyticData from './structures/AnalyticData'

export default class Client extends SapphireClient {
  public prisma!: PrismaClient
  constructor(options: ClientOptions) {
    super(options)

    container.analytics = envParseBoolean('INFLUX_ENABLED') ? new AnalyticData() : null
  }

  public async start(): Promise<this> {
    await this._init()
    await super.login()

    return this
  }

  public stop() {
    this.logger.warn('Received exit signal. Terminating in 5 seconds...')
    this.destroy()
    setTimeout(() => {
      void this.prisma.$disconnect()
      this.logger.warn('Terminating...')
      process.exit(0)
    }, 5000)
  }

  private async _init() {
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

  public fetchPrefix = async (message: Message) => {
    const guild = await this.prisma.guildSettings.findUnique({
      where: {
        guildId: message.guild!.id
      }
    })

    return guild?.prefix ?? envParseString('PREFIX')
  }
}

import { PrismaClient } from '@prisma/client'
import { SapphireClient } from '@sapphire/framework'
import './setup'

export default class Client extends SapphireClient {
  public prisma!: PrismaClient

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


    await prisma.$connect()

    process.once('SIGINT', () => this.stop())
    process.once('SIGTERM', () => this.stop())
  }
}

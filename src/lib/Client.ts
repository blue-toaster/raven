import { SapphireClient } from '@sapphire/framework'
import './setup'

export default class Client extends SapphireClient {
  public async start(): Promise<this> {
    this._init()
    await super.login()

    return this
  }

  public stop() {
    this.logger.warn('Received exit signal. Terminating in 5 seconds...')
    this.destroy()
    setTimeout(() => {
      this.logger.warn('Terminating...')
      process.exit(0)
    }, 5000)
  }

  private _init() {
    process.once('SIGINT', () => this.stop())
    process.once('SIGTERM', () => this.stop())
  }
}

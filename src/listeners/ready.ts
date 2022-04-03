import { envParseBoolean } from '#lib/env'
import { Events } from '#types'
import { getPkg } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import type { ListenerOptions } from '@sapphire/framework'
import { Listener, Store } from '@sapphire/framework'
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette'

const dev = process.env.NODE_ENV !== 'production'

@ApplyOptions<ListenerOptions>({
  once: true
})
export default class UserEvent extends Listener {
  private readonly style = dev ? yellow : blue

  public run() {
    this.init()
    this.printBanner()
    this.printStoreDebugInformation()
    this.container.client.guilds.cache.map(async guild => {
      await guild.members.fetch()
    })
  }

  private printBanner() {
    const success = green('+')

    const llc = dev ? magentaBright : white
    const blc = dev ? magenta : blue

    const line01 = llc('')
    const line02 = llc('')
    const line03 = llc('')

    // Offset Pad
    const pad = ' '.repeat(7)

    console.log(
      String.raw`
${line01} ${pad}${blc(getPkg().version)}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
    )
  }

  private printStoreDebugInformation() {
    const { client, logger } = this.container
    const stores = [...client.stores.values()]
    const last = stores.pop()!

    for (const store of stores) logger.info(this.styleStore(store, false))
    logger.info(this.styleStore(last, true))
  }

  private styleStore(store: Store<any>, last: boolean) {
    return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`)
  }

  private init() {
    if (envParseBoolean('INFLUX_ENABLED')) {
      this.container.client.emit(Events.AnalyticSync)
    }
  }
}

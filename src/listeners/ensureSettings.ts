import { readSettings, writeSettings } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import type { Message } from 'discord.js'

const cache: string[] = []

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate
})
export class UserEvent extends Listener {
  public async run(message: Message): Promise<boolean> {
    if (cache.includes(message.guild!.id)) return true

    const data = await readSettings(message.guild!.id)

    if (!data) {
      await writeSettings(message.guild!.id, {})
    }

    cache.push(message.guild!.id)

    return true
  }
}

import { createSettings, readSettings } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import type { Message } from 'discord.js'

const cached = new Set<string>()

@ApplyOptions<ListenerOptions>({
  event: Events.MessageCreate
})
export default class ensureGuildSettingsExist extends Listener {
  public async run(message: Message): Promise<boolean> {
    if (cached.has(message.guild!.id)) return true

    const guild = await readSettings(message.guild!.id)

    if (!guild) {
      await createSettings(message.guild!.id)
    }

    cached.add(message.guild!.id)

    return true
  }
}

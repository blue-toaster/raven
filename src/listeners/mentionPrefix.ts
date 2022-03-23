import { envParseString } from '#lib/env'
import { readSettings } from '#util'
import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import type { Message } from 'discord.js'

@ApplyOptions<ListenerOptions>({
  event: Events.MentionPrefixOnly
})
export default class mentionPrefix extends Listener {
  public async run(message: Message) {
    const guild = await readSettings(message.guild!.id)

    return message.channel.send(`This Guild's current prefix is: ${guild?.prefix ?? envParseString('PREFIX')}`)
  }
}

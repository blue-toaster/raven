import { envParseString } from '#lib/env'
import { ApplyOptions } from '@sapphire/decorators'
import { Events, Listener, ListenerOptions } from '@sapphire/framework'
import type { Message } from 'discord.js'

@ApplyOptions<ListenerOptions>({
  event: Events.MentionPrefixOnly
})
export default class mentionPrefix extends Listener {
  public async run(message: Message) {
    const guildPrefix = await this.container.client.prisma.guildSettings.findUnique({
      where: {
        guildId: message.guild!.id
      }
    })

    return message.channel.send(`This Guild's current prefix is: ${guildPrefix?.prefix ?? envParseString('PREFIX')}`)
  }
}

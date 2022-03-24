import { ModerationCommand } from '#lib/structures/ModerationCommand'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import type { Message, TextChannel } from 'discord.js'

@ApplyOptions<ModerationCommand.Options>({
  description: 'Unlocks a locked discord channel',
  aliases: ['ul'],
  requiredUserPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
  requiredClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
  preconditions: ['GuildTextOnly']
})
export default class Unlock extends ModerationCommand {
  public async messageRun(message: Message, args: ModerationCommand.Args) {
    const channel = await args.pick('guildTextChannel').catch(() => message.channel as TextChannel)

    if (!this.locked(channel)) return send(message, 'This channel is not locked.')

    await channel.permissionOverwrites.edit(message.guild!.roles.everyone, { SEND_MESSAGES: true })

    return await send(message,
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      `Unlocked ${channel.toString()}`
    )
  }

  private locked(channel: TextChannel) {
    return channel.permissionOverwrites.cache.get(channel.guild.roles.everyone.id)?.deny.has('SEND_MESSAGES')
  }
}

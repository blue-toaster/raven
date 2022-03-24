import { ModerationCommand } from '#lib/structures/ModerationCommand'
import { ApplyOptions } from '@sapphire/decorators'
import { send } from '@sapphire/plugin-editable-commands'
import { DurationFormatter } from '@sapphire/time-utilities'
import type { Message, TextChannel } from 'discord.js'

@ApplyOptions<ModerationCommand.Options>({
  description: 'Locks a discord channel',
  aliases: ['l'],
  requiredUserPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
  requiredClientPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
  preconditions: ['GuildTextOnly']
})
export default class Lock extends ModerationCommand {
  public async messageRun(message: Message, args: ModerationCommand.Args) {
    const channel = await args.pick('guildTextChannel').catch(() => message.channel as TextChannel)
    const duration = await args.pick('time').catch(() => 0)

    if (this.lock(channel)) return send(message, 'This channel is already locked!')

    await channel.permissionOverwrites.edit(message.guild!.roles.everyone, { SEND_MESSAGES: false })

    if (duration) this.container.tasks.create('channelUnlock', { guild: message.guild?.id, channel: channel.id }, duration)

    return await send(message,
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      `Locking ${channel.toString()} ${duration ? `For ${new DurationFormatter().format(duration)}` : 'Indefinitely'}`
    )
  }

  private lock(channel: TextChannel) {
    return channel.permissionOverwrites.cache.get(channel.guild.roles.everyone.id)?.deny.has('SEND_MESSAGES')
  }
}

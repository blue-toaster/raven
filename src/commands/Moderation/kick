import { ModerationCommand } from '#lib/structures/ModerationCommand'
import { getModeration } from '#lib/structures/ModerationManager'
import { ApplyOptions } from '@sapphire/decorators'
import type { GuildMember, Message } from 'discord.js'

@ApplyOptions<ModerationCommand.Options>({
  description: 'Kicks discord members',
  aliases: ['k', 'boot'],
  requiredUserPermissions: ['KICK_MEMBERS'],
  requiredClientPermissions: ['KICK_MEMBERS'],
  preconditions: ['GuildTextOnly']
})
export default class Kick extends ModerationCommand {
  public async messageRun(message: Message, args: ModerationCommand.Args) {
    let users: GuildMember[] = await args.repeat('member')
    const reason = await args.pick('string').catch(() => 'No reason provided')
    const silent = args.getFlags('silent')

    const manageable = this.getModeratable(users)

    if (!manageable.length) {
      return await message.channel.send(
        users.length === 1 ? 'You cannot kick the specified user' : 'You cannot kick any of the specified users'
      )
    }

    await getModeration(message.guild!).kick(manageable, message.author.tag, reason, silent)

    return await message.channel.send(
      `Successfully kicked ${users.length > 1 ? `${manageable.length} Users.` : users[0].toString()}`
    )
  }
}

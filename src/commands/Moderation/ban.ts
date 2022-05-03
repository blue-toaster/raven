import { ModerationCommand } from '#lib/structures/ModerationCommand'
import { getModeration } from '#lib/structures/ModerationManager'
import { ApplyOptions } from '@sapphire/decorators'
import type { GuildMember, Message } from 'discord.js'

@ApplyOptions<ModerationCommand.Options>({
  description: 'Bans discord members',
  aliases: ['b', 'hammer'],
  flags: ['soft', 'silent'],
  requiredUserPermissions: ['BAN_MEMBERS'],
  requiredClientPermissions: ['BAN_MEMBERS'],
  preconditions: ['GuildTextOnly']
})
export default class Ban extends ModerationCommand {
  public async messageRun(message: Message, args: ModerationCommand.Args) {
    let users: GuildMember[] = await args.repeat('member')
    const reason = await args.rest('string').catch(() => 'No reason provided')
    const duration = await args.pick('time').catch(() => 0)
    const soft = args.getFlags('soft')
    const silent = args.getFlags('silent')

    const manageable = this.getModeratable(users)

    if (!manageable.length) {
      return await message.channel.send(
        users.length === 1 ? 'You cannot ban the specified user' : 'You cannot ban any of the specified users'
      )
    }


    await getModeration(message.guild!).ban(manageable, message.author.tag, reason, duration, soft, silent)

    return await message.channel.send(
      `Successfully banned ${users.length > 1 ? `${manageable.length} Users.` : users[0].toString()}`
    )
  }
}

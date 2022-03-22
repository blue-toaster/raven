import { ModerationCommand } from '#lib/structures/ModerationCommand'
import { ApplyOptions } from '@sapphire/decorators'
import type { Guild, GuildMember, Message } from 'discord.js'

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
    const duration = await args.pick('time').catch(() => 0)
    const reason = await args.rest('string').catch(() => 'No reason provided')
    const soft = args.getFlags('soft')
    const silent = args.getFlags('silent')

    const manageable = this.getModeratable(users)

    if (!manageable.length) {
      return await message.channel.send(
        users.length === 1 ? 'You cannot ban the specified user' : 'You cannot ban any of the specified users'
      )
    }

    await this.execute(manageable, message.author.tag, reason, duration, message.guild!, soft, silent)

    return await message.channel.send(
      `Successfully banned ${users.length > 1 ? `${manageable.length} Users.` : users[0].toString()}`
    )
  }

  private async execute(users: GuildMember[], moderator: string, reason: string, duration: number, guild: Guild, soft: boolean, silent: boolean) {
    for (const user of users) {
      if (!user.bannable) return

      if (!silent) {
        await this.sendDM(
          user,
          `You have been ${soft ? 'soft banned' : 'banned'} from \`${user.guild.name}\` for: ${reason}`
        )
      }

      void user.ban({ reason: `${moderator} | ${reason}` })

      if (soft) void user.guild.members.unban(user, 'Soft ban')
    }

    if (duration) this.container.tasks.create('tempBan', { users: users.map(u => u.id), guild: guild.id }, duration)
  }
}

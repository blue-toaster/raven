import { getGuild, readSettings } from '#util'
import { DurationFormatter } from '@sapphire/time-utilities'
import { Guild, GuildMember, GuildResolvable, MessageEmbed, WebhookClient } from 'discord.js'

enum ModAction {
  Ban = 'Ban',
  TempBan = 'TempBan',
  SoftBan = 'SoftBan',
  Kick = 'Kick',
}

interface LogContext {
  soft?: boolean
  temporary?: boolean
  reason: string
  moderator: string
  target: string
  time?: number
}

const cache = new WeakMap<Guild, ModerationManger>()

export default class ModerationManger {
  public readonly guild: Guild
  public constructor(guild: Guild) {
    this.guild = guild
  }

  public async ban(user: GuildMember, moderator: string, reason: string, soft: boolean, silent: boolean): Promise<unknown> {
    if (!silent) {
      await this.sendDM(
        user,
        `You have been ${soft ? 'soft banned' : 'banned'} from \`${user.guild.name}\` for: ${reason}`
      )
    }

    void user.ban({ reason: `${moderator} | ${reason}` })

    if (soft) void user.guild.members.unban(user, 'Soft ban')

    return void this.logAction(soft ? ModAction.SoftBan  : ModAction.Ban, { moderator, reason, soft, target: user.toString() })
  }

  public async kick(user: GuildMember, moderator: string, reason: string, silent: boolean): Promise<void> {
    if (!silent) await this.sendDM(user, `You have been kicked from \`${user.guild.name}\` for: ${reason}`)

    void user.kick(`${moderator} | ${reason}`)

    void this.logAction(ModAction.Kick, { moderator, reason, target: user.toString() })
  }

  private async logAction(action: ModAction, context: LogContext): Promise<unknown> {
    const settings = await readSettings(this.guild.id)

    if (!settings?.modlog) return null
    const hook = new WebhookClient({ url: settings.modlog })

    const embed = new MessageEmbed()
      .setTitle('Moderation Log')
      .setColor(action === ModAction.Ban ? 'RED' : 'YELLOW')
      .addField('Type', action, true)
      .addField('User', context.target, true)
      .addField('Moderator', context.moderator, true)
      .addField('Reason', context.reason, true)

    if (action === ModAction.TempBan && context.time) {
      const formatted = new DurationFormatter().format(context.time)
      embed.addField('Ends', formatted, true)
    }

    return await hook.send({ embeds: [embed] })
  }

  private async sendDM(target: GuildMember, content: string): Promise<unknown> {
    const dm = await target.createDM()

    return await dm.send(content)
  }
}

export function getModeration(_guild: GuildResolvable): ModerationManger {
  const guild = getGuild(_guild)
  const cached = cache.get(guild!)
  if (cached !== undefined) return cached

  const manager = new ModerationManger(guild!)

  cache.set(guild!, manager)

  return manager
}
